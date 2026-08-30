import type { Stripe } from "stripe";

import { getStripe } from "@/lib/stripe";
import {
  confirmOrderToCustomer,
  notifyDispute,
  notifyOrder,
  notifyRefund,
} from "@/lib/order-email";
import { decrementStock, reportSoldOut, restoreStock } from "@/lib/stock";

/*
 * The only place an order becomes paid. The success redirect proves nothing —
 * a customer can reach it by typing the URL, and can also close the tab after
 * paying and never reach it at all.
 */

/**
 * Fast path for a redelivery landing on the same warm instance. It is only a
 * cache — serverless gives every instance its own memory, so the durable check
 * is the `efamy_notified` flag written onto the Stripe session below.
 */
const seen = new Set<string>();

/** Stripe session metadata keys marking which of the two emails have gone. */
const NOTIFIED = "efamy_notified";
/** Stops a redelivered event counting the same order down twice. */
const COUNTED = "efamy_stock_counted";
const CONFIRMED = "efamy_customer_confirmed";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("Stripe webhook received but STRIPE_WEBHOOK_SECRET is unset");
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  // Must be the raw body: parsing it first breaks signature verification.
  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    // An unverified payload is not from Stripe and is never acted on.
    console.error("Stripe webhook signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (seen.has(event.id)) {
    return Response.json({ received: true, duplicate: true });
  }
  seen.add(event.id);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // `complete` plus `paid` is the only combination that means money moved.
    if (session.status === "complete" && session.payment_status === "paid") {
      try {
        /*
         * The webhook payload omits line items and the packing list wants them,
         * but the notification must not depend on a second API call succeeding.
         * If the expand fails we send what the payload already gave us — an
         * email without an itemised list still tells Efamy an order exists.
         */
        let full = session;

        try {
          full = await getStripe().checkout.sessions.retrieve(session.id, {
            expand: ["line_items"],
          });
        } catch (error) {
          console.error("Could not expand line items for", session.id, error);
        }

        /*
         * Durable, cross-instance idempotency. Stripe is already the order
         * book, so it doubles as the store that remembers whether this order
         * was announced — no database, no extra service to own.
         *
         * Checked after the expand so we read the freshest metadata, and
         * written after the send: a duplicate email is a far smaller failure
         * than an order nobody hears about.
         */
        const toldEfamy = full.metadata?.[NOTIFIED] === "1";
        const toldCustomer = full.metadata?.[CONFIRMED] === "1";

        if (toldEfamy && toldCustomer) {
          return Response.json({ received: true, duplicate: true });
        }

        /*
         * Two emails, tracked separately, because a retry must not resend the
         * one that already worked. Efamy hearing about the same order twice is
         * confusing; the customer being emailed their receipt twice looks like
         * they were charged twice.
         */
        const sentToEfamy = toldEfamy || (await notifyOrder(full));
        const sentToCustomer =
          toldCustomer || (await confirmOrderToCustomer(full));

        /*
         * Counted before the emails and flagged separately, so a retry after a
         * mail failure does not take the stock down again. A failure here is
         * logged and swallowed: an uncounted jar is a smaller problem than an
         * order Stripe keeps retrying.
         */
        if (full.metadata?.[COUNTED] !== "1") {
          try {
            await reportSoldOut(await decrementStock(full));
          } catch (error) {
            console.error("Stock count failed for", session.id, error);
          }
        }

        const metadata = { ...(full.metadata ?? {}) };
        metadata[COUNTED] = "1";
        if (sentToEfamy) metadata[NOTIFIED] = "1";
        if (sentToCustomer) metadata[CONFIRMED] = "1";

        // Only write when something actually changed, so a send that failed
        // outright never touches the session.
        if (sentToEfamy !== toldEfamy || sentToCustomer !== toldCustomer) {
          try {
            await getStripe().checkout.sessions.update(session.id, {
              metadata,
            });
          } catch (error) {
            console.error(
              "Could not mark order emails sent",
              session.id,
              error,
            );
          }
        }

        /*
         * An email that did not send is the one case worth failing on. Stripe
         * retries a non-2xx with backoff for days, which is exactly the
         * behaviour wanted when a provider is briefly down or a key has just
         * been fixed — and a run of failures is visible in the Stripe
         * dashboard, where a swallowed error is one log line nobody reads.
         *
         * The flags are written first, so the retry only sends what is missing.
         */
        if (!sentToEfamy || !sentToCustomer) {
          seen.delete(event.id);
          return new Response("Order email failed", { status: 500 });
        }
      } catch (error) {
        /*
         * A failed email must never lose an order. Stripe holds the record, so
         * we log and still acknowledge — returning an error here would make
         * Stripe retry a payment we have already accepted.
         */
        console.error("Order notification failed", session.id, error);
      }
    }
  }

  /*
   * A refund and a dispute both mean money leaving, and neither is visible
   * from the shop. The order is found from the payment so the email can name
   * the customer rather than an id.
   */
  if (
    event.type === "charge.refunded" ||
    event.type === "charge.dispute.created"
  ) {
    const charge =
      event.type === "charge.refunded"
        ? event.data.object
        : ((event.data.object as Stripe.Dispute).charge as string);

    const paymentIntent =
      typeof charge === "string"
        ? undefined
        : ((charge.payment_intent as string | null) ?? undefined);

    let session: Stripe.Checkout.Session | null = null;

    try {
      const id =
        paymentIntent ??
        (typeof charge === "string"
          ? (((await getStripe().charges.retrieve(charge)).payment_intent as
              string | null) ?? undefined)
          : undefined);

      if (id) {
        const found = await getStripe().checkout.sessions.list({
          payment_intent: id,
          limit: 1,
        });
        session = found.data[0] ?? null;
      }
    } catch (error) {
      console.error("Could not match the order for", event.id, error);
    }

    try {
      if (event.type === "charge.refunded") {
        if (session) {
          await restoreStock(session);
          await notifyRefund(
            session,
            (event.data.object as Stripe.Charge).amount_refunded,
          );
        }
      } else {
        await notifyDispute(session, event.data.object as Stripe.Dispute);
      }
    } catch (error) {
      console.error("Refund or dispute handling failed", event.id, error);
      return new Response("Handling failed", { status: 500 });
    }
  }

  return Response.json({ received: true });
}

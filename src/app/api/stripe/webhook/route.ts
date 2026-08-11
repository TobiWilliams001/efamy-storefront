import type { Stripe } from "stripe";

import { getStripe } from "@/lib/stripe";
import { notifyOrder } from "@/lib/order-email";

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

/** Stripe session metadata key marking that Efamy has been told about an order. */
const NOTIFIED = "efamy_notified";

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
        if (full.metadata?.[NOTIFIED] === "1") {
          return Response.json({ received: true, duplicate: true });
        }

        await notifyOrder(full);

        try {
          await getStripe().checkout.sessions.update(session.id, {
            metadata: { ...(full.metadata ?? {}), [NOTIFIED]: "1" },
          });
        } catch (error) {
          console.error("Could not mark order notified", session.id, error);
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

  return Response.json({ received: true });
}

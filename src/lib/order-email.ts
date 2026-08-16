import "server-only";

import type Stripe from "stripe";

import { orderInbox, sendEmail } from "@/lib/email";

function money(amount: number | null | undefined): string {
  return amount == null ? "not given" : `£${(amount / 100).toFixed(2)}`;
}

function addressLines(session: Stripe.Checkout.Session): string {
  const a = session.collected_information?.shipping_details?.address;
  if (!a) return "No delivery address on the order";

  return [a.line1, a.line2, a.city, a.state, a.postal_code, a.country]
    .filter(Boolean)
    .join("\n");
}

/**
 * Tells Efamy an order has come in.
 *
 * Plain text on purpose: it arrives readably on any phone, cannot render
 * wrongly, and is the thing someone reads while packing a box.
 *
 * Never throws. Stripe holds the authoritative record, so a failed notification
 * must not block or reverse a payment.
 *
 * Returns whether the email actually left, because "we tried" and "Efamy knows"
 * are different facts and only the caller can decide what to do about the gap.
 */
export async function notifyOrder(
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  const customer = session.customer_details;

  const items =
    session.line_items?.data
      .map(
        (line) =>
          `  ${line.quantity} x ${line.description}  ${money(line.amount_total)}`,
      )
      .join("\n") ?? "  (expand line_items on the session to list these)";

  const body = [
    `New order, ${money(session.amount_total)}`,
    "",
    "ITEMS",
    items,
    "",
    `Delivery: ${money(session.shipping_cost?.amount_total)}`,
    `Total paid: ${money(session.amount_total)}`,
    "",
    "CUSTOMER",
    `  ${customer?.name ?? "No name given"}`,
    `  ${customer?.email ?? "No email"}`,
    `  ${customer?.phone ?? "No phone"}`,
    "",
    "DELIVER TO",
    addressLines(session)
      .split("\n")
      .map((l) => `  ${l}`)
      .join("\n"),
    "",
    "REFERENCES",
    `  Checkout session: ${session.id}`,
    // The payment intent is what a refund, dispute or chargeback is filed
    // against, so it belongs in the record Efamy actually keeps.
    `  Payment: ${
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? "not available")
    }`,
  ].join("\n");

  const result = await sendEmail({
    to: orderInbox(),
    subject: `New Efamy order, ${money(session.amount_total)}`,
    text: body,
    // Replying goes straight to the customer.
    replyTo: customer?.email ?? undefined,
  });

  if (!result.sent) {
    // Logged so the order is still recoverable from the server output.
    console.error("Order email not sent:", result.reason, "\n", body);
  }

  return result.sent;
}

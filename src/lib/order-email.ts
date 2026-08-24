import "server-only";

import type Stripe from "stripe";

import { siteConfig } from "@/config/site";
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

/**
 * Tells the customer their order went through.
 *
 * Sent from the automated subdomain, never the address a person reads. The
 * body says the mail is automatic and points at the inbox a human watches,
 * rather than ordering the customer not to reply. Reply-To points there too,
 * because some people reply regardless and a bounce is a worse answer than a
 * message that lands somewhere useful.
 *
 * Never throws, for the same reason as the notification above. The customer has
 * already seen the confirmation page and Stripe has the money; a failed receipt
 * is a thing to fix, not a reason to fail the request that carried it.
 */
export async function confirmOrderToCustomer(
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  const to = session.customer_details?.email;

  if (!to) {
    console.error("No customer email on session", session.id);
    return false;
  }

  const items =
    session.line_items?.data
      .map(
        (line) =>
          `  ${line.quantity} x ${line.description}  ${money(line.amount_total)}`,
      )
      .join("\n") ?? "  (your order is on its way)";

  const body = [
    `Thank you for your order.`,
    "",
    "WHAT YOU ORDERED",
    items,
    "",
    `Delivery: ${money(session.shipping_cost?.amount_total)}`,
    `Total paid: ${money(session.amount_total)}`,
    "",
    "DELIVERING TO",
    addressLines(session)
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n"),
    "",
    `Order reference: ${session.id}`,
    "",
    "This email was sent automatically. For anything at all about your order,",
    `write to ${siteConfig.contact.email} and a person will answer.`,
    "",
    siteConfig.legalName,
  ].join("\n");

  const result = await sendEmail({
    to,
    subject: "Your Efamy order",
    text: body,
    replyTo: siteConfig.contact.email,
  });

  if (!result.sent) {
    console.error(
      "Order confirmation to customer failed",
      session.id,
      result.reason,
    );
  }

  return result.sent;
}

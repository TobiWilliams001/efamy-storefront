import "server-only";

import type Stripe from "stripe";

import { siteConfig } from "@/config/site";
import { orderInbox, sendEmail } from "@/lib/email";
import {
  escapeHtml,
  itemRows,
  layout,
  panel,
  totalRows,
} from "@/lib/email-template";

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

/** The ordered items, in a shape both the text and the HTML can render. */
function lineItems(session: Stripe.Checkout.Session) {
  return (
    session.line_items?.data.map((line) => ({
      quantity: line.quantity ?? 1,
      description: line.description ?? "Item",
      amount: money(line.amount_total),
    })) ?? []
  );
}

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

  const customerLine = [
    customer?.name,
    customer?.email,
    customer?.phone,
  ].filter(Boolean) as string[];

  /*
   * Built for someone standing at a bench with a box. The items come first and
   * largest, the address is a block that can be read at arm's length, and the
   * Stripe references sit at the bottom where they are needed only if a refund
   * or a dispute comes up.
   */
  const html = layout({
    heading: `New order, ${money(session.amount_total)}`,
    preheader: `${session.line_items?.data.length ?? 0} lines to pack for ${customer?.name ?? "a customer"}.`,
    content: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
        ${itemRows(lineItems(session))}
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0 0;">
        ${totalRows([
          {
            label: "Delivery",
            value: money(session.shipping_cost?.amount_total),
          },
          {
            label: "Total paid",
            value: money(session.amount_total),
            strong: true,
          },
        ])}
      </table>

      ${panel("Deliver to", escapeHtml(addressLines(session)).split("\n").join("<br>"))}
      ${panel("Customer", customerLine.map((entry) => escapeHtml(entry)).join("<br>") || "No details given")}
      ${panel(
        "References",
        `<span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;">
          Checkout ${escapeHtml(session.id)}<br>
          Payment ${escapeHtml(
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent?.id ?? "not available"),
          )}
        </span>`,
      )}
    `,
    footnote: customer?.email
      ? `Replying to this email goes straight to ${escapeHtml(customer.email)}.`
      : undefined,
  });

  const result = await sendEmail({
    to: orderInbox(),
    subject: `New Efamy order, ${money(session.amount_total)}`,
    text: body,
    html,
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

  const rows = lineItems(session);

  const html = layout({
    heading: "Thank you for your order",
    preheader: `Order confirmed, ${money(session.amount_total)}. We will let you know when it leaves us.`,
    intro: `We have it, and we are getting it ready. Here is what is on its way.`,
    content: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
        ${itemRows(rows)}
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0 0;">
        ${totalRows([
          {
            label: "Delivery",
            value: money(session.shipping_cost?.amount_total),
          },
          {
            label: "Total paid",
            value: money(session.amount_total),
            strong: true,
          },
        ])}
      </table>

      ${panel("Delivering to", escapeHtml(addressLines(session)).split("\n").join("<br>"))}
      ${panel("Order reference", `<span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;">${escapeHtml(session.id)}</span>`)}
    `,
    footnote: `This email was sent automatically. For anything at all about your order, write to <a href="mailto:${siteConfig.contact.email}" style="color:#8b2d2d;">${siteConfig.contact.email}</a> and a person will answer.`,
  });

  const result = await sendEmail({
    to,
    subject: "Your Efamy order",
    text: body,
    html,
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

/** Tells Efamy money has gone back, and what to take off the packing bench. */
export async function notifyRefund(
  session: Stripe.Checkout.Session,
  amount: number,
): Promise<void> {
  const customer = session.customer_details;

  await sendEmail({
    to: orderInbox(),
    subject: `Refunded ${money(amount)} to ${customer?.name ?? "a customer"}`,
    text: [
      `${money(amount)} has been refunded.`,
      "",
      "CUSTOMER",
      `  ${customer?.name ?? "No name given"}`,
      `  ${customer?.email ?? "No email"}`,
      "",
      "ORDER",
      `  ${money(session.amount_total)} originally`,
      `  Checkout session ${session.id}`,
      "",
      "Stripe has emailed them about the refund. Anything counted has been put",
      "back into stock, so do not adjust it by hand.",
      "",
      "If the parcel has already gone out, it is worth deciding whether to ask",
      "for it back before restocking those jars.",
    ].join("\n"),
    replyTo: customer?.email ?? undefined,
  });
}

/**
 * A dispute is a deadline, so this email leads with it.
 *
 * Stripe pulls the money immediately and Efamy has a fixed window to answer.
 * The evidence that wins a food delivery dispute is proof it arrived, which
 * only Efamy holds.
 */
export async function notifyDispute(
  session: Stripe.Checkout.Session | null,
  dispute: Stripe.Dispute,
): Promise<void> {
  const by = dispute.evidence_details?.due_by;
  const deadline = by
    ? new Date(by * 1000).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "the date shown in Stripe";

  await sendEmail({
    to: orderInbox(),
    subject: `Action needed: ${money(dispute.amount)} disputed, reply by ${deadline}`,
    text: [
      `A customer has disputed a payment of ${money(dispute.amount)}.`,
      `Stripe has already taken the money back. You have until ${deadline} to respond.`,
      "",
      `Reason given: ${dispute.reason.replace(/_/g, " ")}`,
      "",
      session
        ? [
            "ORDER",
            `  ${session.customer_details?.name ?? "No name"}`,
            `  ${session.customer_details?.email ?? "No email"}`,
            `  ${money(session.amount_total)}`,
            `  Checkout session ${session.id}`,
          ].join("\n")
        : "  The original order could not be matched automatically.",
      "",
      "WHAT WINS THIS",
      "  Proof it was delivered: the courier receipt, tracking number, and any",
      "  signature. Anything the customer wrote to you. The delivery address as",
      "  they gave it.",
      "",
      "Upload that to Stripe under Payments, then Disputes. Doing nothing means",
      "the money stays with the customer.",
    ].join("\n"),
  });
}

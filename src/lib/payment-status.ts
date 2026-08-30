import "server-only";

import { getStripe, paymentsEnabled } from "@/lib/stripe";

/**
 * What Stripe knows: whether money moved. Deliberately *not* called order
 * status — this application does not track fulfilment, and a type named for the
 * order would invite someone to read packing or shipping state into it.
 */
export type PaymentStatus = "paid" | "pending" | "unknown";

/** Enough to report the sale to analytics, and nothing more. */
export type ConfirmedPayment = {
  status: PaymentStatus;
  transactionId?: string;
  /** Major units, as GA4 expects. */
  value?: number;
  currency?: string;
  shipping?: number;
  /**
   * The address Stripe collected. Shown back on the confirmation page so a
   * customer who mistyped it finds out immediately, rather than deciding we
   * never wrote to them.
   */
  email?: string;
};

/**
 * Asks Stripe whether this session was actually paid.
 *
 * Reaching the success URL proves nothing — it can be typed, shared, or
 * bookmarked, and a customer who abandons payment can still land on it. So the
 * page never claims an order exists on the strength of a redirect. This is a
 * direct server-to-Stripe call, which is authoritative in the same way the
 * webhook is, and it does not depend on the webhook having arrived first: the
 * redirect frequently beats it.
 *
 * "pending" covers slower payment methods that settle after the redirect, where
 * the honest answer is that we are still waiting rather than that it failed.
 */
export async function confirmPayment(
  sessionId: string | undefined,
): Promise<ConfirmedPayment> {
  if (!sessionId || !sessionId.startsWith("cs_")) return { status: "unknown" };
  if (!paymentsEnabled()) return { status: "unknown" };

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return {
        status: "paid",
        // Stripe's session id doubles as the GA4 transaction id, so a refresh
        // reports the same sale rather than inventing a second one.
        transactionId: session.id,
        value: (session.amount_total ?? 0) / 100,
        currency: (session.currency ?? "gbp").toUpperCase(),
        shipping: (session.shipping_cost?.amount_total ?? 0) / 100,
        email: session.customer_details?.email ?? undefined,
      };
    }

    if (session.status === "open") return { status: "pending" };

    return {
      status: session.payment_status === "unpaid" ? "unknown" : "pending",
    };
  } catch {
    // An id that Stripe does not recognise is not an order.
    return { status: "unknown" };
  }
}

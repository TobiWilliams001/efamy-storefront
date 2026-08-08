import "server-only";

import { getStripe } from "@/lib/stripe";

export type OrderStatus = "paid" | "pending" | "unknown";

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
export async function confirmOrder(
  sessionId: string | undefined,
): Promise<OrderStatus> {
  if (!sessionId || !sessionId.startsWith("cs_")) return "unknown";
  if (!process.env.STRIPE_SECRET_KEY) return "unknown";

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") return "paid";
    if (session.status === "open") return "pending";

    return session.payment_status === "unpaid" ? "unknown" : "pending";
  } catch {
    // An id that Stripe does not recognise is not an order.
    return "unknown";
  }
}

import "server-only";

import type Stripe from "stripe";

import { siteConfig } from "@/config/site";

function formatPence(amount: number | null): string {
  return amount === null ? "—" : `£${(amount / 100).toFixed(2)}`;
}

/**
 * Tells Efamy an order has come in.
 *
 * No email provider is connected yet, so this logs the order and returns. That
 * is deliberately not a failure: Stripe already holds the authoritative record,
 * and a missing notification must never block or reverse a payment. Wire a
 * provider in here and the rest of the flow is unchanged.
 */
export async function notifyOrder(session: Stripe.Checkout.Session) {
  const summary = {
    sessionId: session.id,
    total: formatPence(session.amount_total),
    shipping: formatPence(session.shipping_cost?.amount_total ?? null),
    email: session.customer_details?.email ?? "unknown",
    name: session.customer_details?.name ?? "unknown",
    phone: session.customer_details?.phone ?? "not given",
    address: session.collected_information?.shipping_details?.address,
    notify: siteConfig.contact.email,
  };

  console.info("Order paid", JSON.stringify(summary));
}

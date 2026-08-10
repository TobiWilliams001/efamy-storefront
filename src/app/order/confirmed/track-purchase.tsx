"use client";

import { useEffect, useRef } from "react";

import { track } from "@/lib/analytics";

/**
 * Reports the sale to GA4, once.
 *
 * Only rendered after Stripe has confirmed payment, so revenue in analytics
 * matches revenue in Stripe. The transaction id is the Stripe session id, which
 * GA4 uses to deduplicate — a customer refreshing the page does not double-count
 * the order.
 */
export function TrackPurchase({
  transactionId,
  value,
  currency,
  shipping,
}: {
  transactionId: string;
  value: number;
  currency: string;
  shipping: number;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    track("purchase", {
      transaction_id: transactionId,
      value,
      currency,
      shipping,
    });
  }, [transactionId, value, currency, shipping]);

  return null;
}

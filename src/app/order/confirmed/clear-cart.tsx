"use client";

import { useEffect, useRef } from "react";

import { useCart } from "@/components/cart/cart-provider";

/**
 * Empties the basket once payment has gone through.
 *
 * Runs exactly once. `clear` is rebuilt whenever the cart changes, so an
 * unguarded effect keyed on it would re-fire the moment it succeeded.
 *
 * Only on this page: clearing when checkout *starts* would lose the basket for
 * anyone who abandons Stripe and comes back.
 */
export function ClearCartOnMount() {
  const { clear } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    clear();
  }, [clear]);

  return null;
}

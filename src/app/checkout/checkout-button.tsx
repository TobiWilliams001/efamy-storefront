"use client";

import { useState } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { startCheckout } from "@/app/checkout/actions";
import { useCart } from "@/components/cart/cart-provider";
import { toMajorUnits, track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function CheckoutButton() {
  const { lines, ready } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    setError(null);

    track("begin_checkout", {
      currency: "GBP",
      value: toMajorUnits(
        lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
      ),
      items: lines.map((line) => ({
        item_id: line.productId,
        item_name: line.name,
        item_variant: line.size,
        price: toMajorUnits(line.price),
        quantity: line.quantity,
      })),
    });

    /*
     * Only what we are allowed to send: what and how many. Prices are looked up
     * again on the server, so nothing here decides what the customer pays.
     */
    const result = await startCheckout({
      lines: lines.map((line) => ({
        slug: line.slug,
        size: line.size,
        quantity: line.quantity,
      })),
    });

    if (result.status === "redirect") {
      window.location.href = result.url;
      return;
    }

    setError(result.message);
    setPending(false);
  }

  if (!ready) return null;

  if (lines.length === 0) {
    return (
      <Button asChild size="xl" variant="outline">
        <Link href={routes.shop}>Shop the range</Link>
      </Button>
    );
  }

  return (
    <div>
      <Button
        size="xl"
        variant="accent"
        onClick={onClick}
        loading={pending}
        className="w-full"
      >
        {pending ? "Taking you to Stripe…" : "Continue to secure payment"}
      </Button>

      {error ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 text-sm text-destructive"
        >
          <TriangleAlert
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          {error}
        </p>
      ) : null}
    </div>
  );
}

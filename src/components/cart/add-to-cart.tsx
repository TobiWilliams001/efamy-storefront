"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product.inStock) {
    return (
      <Button size="xl" disabled className="w-full sm:w-auto">
        Out of stock
      </Button>
    );
  }

  function onAdd() {
    add(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-1 self-start rounded-xl border p-1">
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          disabled={quantity <= 1}
        >
          <Minus />
          <span className="sr-only">Decrease quantity</span>
        </Button>
        <span
          aria-live="polite"
          className="w-10 text-center text-sm font-medium"
        >
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={() => setQuantity((value) => Math.min(99, value + 1))}
          disabled={quantity >= 99}
        >
          <Plus />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>

      <Button size="xl" onClick={onAdd} className="w-full sm:w-auto">
        {added ? (
          <>
            <Check />
            Added to basket
          </>
        ) : (
          "Add to basket"
        )}
      </Button>
    </div>
  );
}

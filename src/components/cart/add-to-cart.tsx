"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { useAddedToBasket } from "@/components/ui/toast";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const added = useAddedToBasket();
  const [sizeIndex, setSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const variant = product.variants[sizeIndex] ?? product.variants[0];
  const hasChoice = product.variants.length > 1;

  return (
    <div>
      {hasChoice ? (
        <fieldset>
          <legend className="text-sm font-medium">Size</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((entry, index) => (
              <label
                key={entry.size}
                className={cn(
                  "cursor-pointer rounded-lg border px-4 py-2.5 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring",
                  index === sizeIndex
                    ? "border-foreground bg-foreground text-background"
                    : "border-neutral-300 hover:border-foreground/40",
                  !entry.inStock && "cursor-not-allowed opacity-40",
                )}
              >
                <input
                  type="radio"
                  name="size"
                  value={entry.size}
                  checked={index === sizeIndex}
                  disabled={!entry.inStock}
                  onChange={() => setSizeIndex(index)}
                  className="sr-only"
                />
                <span data-numeric>{entry.size}</span>
                <span className="sr-only">, {formatPrice(entry.price)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center",
          hasChoice && "mt-6",
        )}
      >
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
            data-numeric
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

        <Button
          size="xl"
          variant="accent"
          disabled={!variant.inStock}
          onClick={() => {
            add(product, variant, quantity);
            added(product.name);
            setQuantity(1);
          }}
          className="w-full sm:w-auto"
        >
          {variant.inStock
            ? `Add to basket · ${formatPrice(variant.price)}`
            : "Out of stock"}
        </Button>
      </div>
    </div>
  );
}

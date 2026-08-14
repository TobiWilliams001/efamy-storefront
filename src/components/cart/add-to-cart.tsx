"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { heatLabels } from "@/components/commerce/heat-badge";
import { useAddedToBasket } from "@/components/ui/toast";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { heatLevels, sizesFor, type Heat, type Product } from "@/types/product";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const added = useAddedToBasket();

  const strengths = heatLevels(product);
  const [heat, setHeat] = useState<Heat | undefined>(strengths[0]);
  const [size, setSize] = useState<string | undefined>(
    sizesFor(product, strengths[0])[0]?.size,
  );
  const [quantity, setQuantity] = useState(1);

  /*
   * Strength is chosen first because it narrows the sizes. Falling back to the
   * first available size keeps the pair valid if a strength is picked that does
   * not carry the currently selected size.
   */
  const sizes = sizesFor(product, heat);
  const variant =
    sizes.find((entry) => entry.size === size) ??
    sizes[0] ??
    product.variants[0];

  const hasStrengthChoice = strengths.length > 1;
  const hasSizeChoice = sizes.length > 1;

  return (
    <div>
      {hasStrengthChoice ? (
        <fieldset>
          <legend className="text-sm font-medium">Strength</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {strengths.map((level) => (
              <label
                key={level}
                className={cn(
                  "min-h-11 cursor-pointer rounded-lg border px-4 py-2.5 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring",
                  level === heat
                    ? "border-foreground bg-foreground text-background"
                    : "border-neutral-300 hover:border-foreground/40",
                )}
              >
                <input
                  type="radio"
                  name="strength"
                  value={level}
                  checked={level === heat}
                  onChange={() => setHeat(level)}
                  className="sr-only"
                />
                {heatLabels[level]}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {hasSizeChoice ? (
        <fieldset className={cn(hasStrengthChoice && "mt-6")}>
          <legend className="text-sm font-medium">Size</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((entry) => (
              <label
                key={entry.size}
                className={cn(
                  "min-h-11 cursor-pointer rounded-lg border px-4 py-2.5 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring",
                  entry.size === variant.size
                    ? "border-foreground bg-foreground text-background"
                    : "border-neutral-300 hover:border-foreground/40",
                  !entry.inStock && "cursor-not-allowed opacity-40",
                )}
              >
                <input
                  type="radio"
                  name="size"
                  value={entry.size}
                  checked={entry.size === variant.size}
                  disabled={!entry.inStock}
                  onChange={() => setSize(entry.size)}
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
          (hasStrengthChoice || hasSizeChoice) && "mt-6",
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

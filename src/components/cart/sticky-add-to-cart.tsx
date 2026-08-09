"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useAddedToBasket } from "@/components/ui/toast";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { lowestPrice, type Product } from "@/types/product";

/**
 * The product page runs long once ingredients, storage, delivery and questions
 * are on it, so the buy button scrolls away. This brings it back on mobile once
 * the real one has left the screen.
 */
export function StickyAddToCart({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const added = useAddedToBasket();
  const [visible, setVisible] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const variant = product.variants[0];
  const many = product.variants.length > 1;

  return (
    <>
      <div ref={sentinel} aria-hidden="true" />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur-md transition-transform duration-200 md:hidden",
          visible ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-neutral-200">
            <Image
              src={product.image.url}
              alt=""
              fill
              sizes="44px"
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p data-numeric className="text-sm text-brand">
              {many
                ? `from ${formatPrice(lowestPrice(product))}`
                : formatPrice(variant.price)}
            </p>
          </div>
          <Button
            size="lg"
            variant="accent"
            onClick={() => {
              if (many) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
              add(product, variant, 1);
              added(product.name);
              setOpen(true);
            }}
          >
            {many ? "Choose size" : "Add"}
          </Button>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";

import { useAddedToBasket } from "@/components/ui/toast";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { inStock, type ProductSummary } from "@/types/product";

/**
 * One-click add for products sold in a single size. Anything with a choice of
 * sizes links to the product page instead, rather than guessing which one.
 */
export function CardAddToCart({ product }: { product: ProductSummary }) {
  const { add } = useCart();
  const added = useAddedToBasket();
  const available = inStock(product);

  if (!available) {
    return (
      <Button size="lg" variant="outline" disabled className="w-full">
        Out of stock
      </Button>
    );
  }

  if (product.variants.length > 1) {
    return (
      <Button asChild size="lg" variant="accent" className="w-full">
        <Link href={routes.product(product.slug)}>Choose size</Link>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      variant="accent"
      className="w-full"
      onClick={() => {
        add(product, product.variants[0], 1);
        added(product.name);
      }}
    >
      Add to basket
    </Button>
  );
}

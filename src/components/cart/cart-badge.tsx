"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function CartBadge() {
  const { itemCount, ready } = useCart();

  return (
    <Button asChild variant="ghost" size="icon-xl" className="relative">
      <Link href={routes.cart}>
        <ShoppingBag />
        {ready && itemCount > 0 ? (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[0.625rem] font-medium text-primary-foreground">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        ) : null}
        <span className="sr-only">
          Basket{ready && itemCount > 0 ? `, ${itemCount} items` : ""}
        </span>
      </Link>
    </Button>
  );
}

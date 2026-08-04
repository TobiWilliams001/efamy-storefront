"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductGridSkeleton } from "@/components/commerce/product-card-skeleton";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

export function CartContents() {
  const { lines, subtotal, itemCount, ready, setQuantity, remove } = useCart();

  if (!ready) {
    return <ProductGridSkeleton count={2} />;
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your basket is empty"
        description="Once you add something, it will show up here."
        action={
          <Button asChild size="xl">
            <Link href={routes.shop}>Start shopping</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
      <ul className="divide-y border-y">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-4 py-5">
            <Link
              href={routes.product(line.slug)}
              className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-white"
            >
              <Image
                src={line.imageUrl}
                alt={line.imageAlt}
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </Link>

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="font-medium">
                    <Link
                      href={routes.product(line.slug)}
                      className="hover:underline"
                    >
                      {line.name}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground">{line.size}</p>
                </div>
                <p className="font-medium">
                  {formatPrice(line.price * line.quantity)}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 rounded-lg border p-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setQuantity(line.productId, line.quantity - 1)
                    }
                    disabled={line.quantity <= 1}
                  >
                    <Minus />
                    <span className="sr-only">
                      Decrease quantity of {line.name}
                    </span>
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {line.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setQuantity(line.productId, line.quantity + 1)
                    }
                    disabled={line.quantity >= 99}
                  >
                    <Plus />
                    <span className="sr-only">
                      Increase quantity of {line.name}
                    </span>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(line.productId)}
                  className="text-muted-foreground"
                >
                  <Trash2 />
                  Remove
                  <span className="sr-only"> {line.name}</span>
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="font-heading text-lg font-medium">Summary</h2>
        <Separator className="my-4" />
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd className="text-muted-foreground">Calculated at checkout</dd>
          </div>
        </dl>
        <Separator className="my-4" />
        <Button asChild size="xl" className="w-full">
          <Link href={routes.checkout}>Checkout</Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="mt-2 w-full">
          <Link href={routes.shop}>Continue shopping</Link>
        </Button>
      </aside>
    </div>
  );
}

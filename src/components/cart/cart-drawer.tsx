"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

export function CartDrawer() {
  const { lines, subtotal, itemCount, isOpen, setOpen } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 pb-4">
          <SheetTitle className="font-heading text-xl">
            Added to your basket
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <ul className="divide-y">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-4 py-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-neutral-200">
                  <Image
                    src={line.imageUrl}
                    alt={line.imageAlt}
                    fill
                    sizes="64px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="flex flex-1 justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{line.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Qty {line.quantity}
                      {line.size ? ` · ${line.size}` : ""}
                    </p>
                  </div>
                  <p data-numeric className="text-sm font-medium">
                    {formatPrice(line.price * line.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t bg-neutral-50 px-6 py-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
            <span data-numeric className="text-lg font-medium">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Delivery calculated at checkout.
          </p>

          <Button asChild size="xl" variant="accent" className="mt-5 w-full">
            <Link href={routes.cart} onClick={() => setOpen(false)}>
              View basket
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="mt-2 w-full"
            onClick={() => setOpen(false)}
          >
            Continue shopping
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

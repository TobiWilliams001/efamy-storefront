import Image from "next/image";
import Link from "next/link";

import { HeatBadge } from "@/components/commerce/heat-badge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { productAccent } from "@/lib/product-accent";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  inStock as anyInStock,
  lowestPrice,
  type ProductSummary,
} from "@/types/product";

const DEFAULT_SIZES =
  "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw";

type ProductCardProps = {
  product: ProductSummary;
  eager?: boolean;
  sizes?: string;
  className?: string;
};

export function ProductCard({
  product,
  eager = false,
  sizes = DEFAULT_SIZES,
  className,
}: ProductCardProps) {
  const { image, heat, isNew, bundleItems, variants } = product;
  const inStock = anyInStock(product);
  const price = lowestPrice(product);
  const cheapest = variants.find((variant) => variant.price === price);
  const isDiscounted =
    cheapest?.compareAtPrice !== undefined && cheapest.compareAtPrice > price;
  const hasSizeChoice = variants.length > 1;
  const accent = productAccent(product.slug);

  return (
    <Card
      className={cn(
        "group relative gap-0 py-0 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-ring hover:shadow-card-hover",
        className,
      )}
    >
      {/*
       * White surface, because the packshots are JPEGs shot on white. On a
       * tinted background the image's own white rectangle shows through. Square
       * rather than portrait so the landscape case shots do not shrink to
       * nothing beside the upright jars.
       */}
      <span
        aria-hidden="true"
        style={{ backgroundColor: accent }}
        className="absolute inset-x-0 top-0 z-10 h-1"
      />
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          placeholder={image.blurDataURL ? "blur" : undefined}
          blurDataURL={image.blurDataURL}
          className={cn(
            "object-contain p-8 transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
            !inStock && "opacity-50",
          )}
        />

        {(isNew || isDiscounted || !inStock || bundleItems?.length) && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {!inStock ? (
              <Badge variant="secondary">Out of stock</Badge>
            ) : (
              <>
                {isNew ? <Badge>New</Badge> : null}
                {bundleItems?.length ? (
                  <Badge variant="secondary">Set</Badge>
                ) : null}
                {isDiscounted ? <Badge variant="outline">Offer</Badge> : null}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg">
            <Link
              href={routes.product(product.slug)}
              className="decoration-1 underline-offset-4 group-hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {product.name}
            </Link>
          </h3>
          {heat ? <HeatBadge heat={heat} className="mt-1 shrink-0" /> : null}
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-pretty text-muted-foreground">
          {product.summary}
        </p>

        <div className="mt-5 flex items-baseline gap-2 border-t pt-4">
          <span data-numeric className="font-medium text-brand">
            {hasSizeChoice ? `from ${formatPrice(price)}` : formatPrice(price)}
          </span>
          {isDiscounted ? (
            <span
              data-numeric
              className="text-sm text-muted-foreground line-through"
            >
              <span className="sr-only">Was </span>
              {formatPrice(cheapest!.compareAtPrice!)}
            </span>
          ) : null}
          <span data-numeric className="ml-auto text-xs text-muted-foreground">
            {hasSizeChoice ? `${variants.length} sizes` : variants[0].size}
          </span>
        </div>
      </div>
    </Card>
  );
}

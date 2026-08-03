import Image from "next/image";
import Link from "next/link";

import { HeatLevel } from "@/components/commerce/heat-level";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";

/**
 * Assumes the default grid below (1 / 2 / 3 / 4 columns against a 1152px
 * container). Pass `sizes` explicitly in any other layout, or the browser will
 * download images at the wrong resolution.
 */
const DEFAULT_SIZES =
  "(min-width: 1024px) 288px, (min-width: 640px) 50vw, 100vw";

type ProductCardProps = {
  product: ProductSummary;
  /**
   * Load the image immediately instead of lazily. Set this on the cards that
   * are above the fold. We deliberately don't use `preload` here: in a grid,
   * which card is the LCP element depends on the viewport, so preloading one
   * would be a guess — `next/image` docs recommend eager loading for this case.
   */
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
  const { image, price, compareAtPrice, heatLevel, inStock, isNew } = product;
  const isDiscounted = compareAtPrice !== undefined && compareAtPrice > price;

  return (
    <Card
      className={cn(
        "group relative gap-0 py-0 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-ring hover:shadow-lg hover:shadow-foreground/5",
        className,
      )}
    >
      <div className="relative aspect-4/5 overflow-hidden bg-muted">
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
            "object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
            !inStock && "opacity-60",
          )}
        />

        {(isNew || isDiscounted || !inStock) && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {!inStock ? (
              <Badge variant="secondary">Out of stock</Badge>
            ) : (
              <>
                {isNew ? <Badge>New</Badge> : null}
                {isDiscounted ? <Badge variant="outline">Offer</Badge> : null}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base leading-snug font-medium">
            {/*
             * Stretched link: the whole card is clickable, but the accessible
             * name stays the product name rather than the image or a bare
             * "read more". Keeps one link per card for screen readers.
             */}
            <Link
              href={routes.product(product.slug)}
              className="after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none"
            >
              {product.name}
            </Link>
          </h3>
          {heatLevel ? (
            <HeatLevel level={heatLevel} className="mt-0.5" />
          ) : null}
        </div>

        <p className="line-clamp-2 text-sm text-pretty text-muted-foreground">
          {product.summary}
        </p>

        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-medium">{formatPrice(price)}</span>
          {isDiscounted ? (
            <span className="text-sm text-muted-foreground line-through">
              <span className="sr-only">Was </span>
              {formatPrice(compareAtPrice)}
            </span>
          ) : null}
          <span className="ml-auto text-sm text-muted-foreground">
            {product.size}
          </span>
        </div>
      </div>
    </Card>
  );
}

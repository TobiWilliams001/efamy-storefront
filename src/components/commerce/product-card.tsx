import Image from "next/image";
import Link from "next/link";

import { HeatBadge } from "@/components/commerce/heat-badge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";

const DEFAULT_SIZES =
  "(min-width: 1024px) 288px, (min-width: 640px) 50vw, 100vw";

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
  const { image, price, compareAtPrice, heat, inStock, isNew } = product;
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
            <Link
              href={routes.product(product.slug)}
              className="after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none"
            >
              {product.name}
            </Link>
          </h3>
          {heat ? <HeatBadge heat={heat} className="mt-0.5" /> : null}
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
          {product.size ? (
            <span className="ml-auto text-sm text-muted-foreground">
              {product.size}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

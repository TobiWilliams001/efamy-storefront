import Image from "next/image";
import Link from "next/link";

import { CardAddToCart } from "@/components/commerce/card-add-to-cart";
import { DietaryBadges } from "@/components/commerce/dietary-badges";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { heatLabels } from "@/components/commerce/heat-badge";
import { cn } from "@/lib/utils";
import {
  heatLevels,
  inStock as anyInStock,
  lowestPrice,
  distinctSizes,
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
  const { image, isNew, isBestSeller, bundleItems, variants } = product;
  const inStock = anyInStock(product);
  const price = lowestPrice(product);
  const cheapest = variants.find((variant) => variant.price === price);
  const isDiscounted =
    cheapest?.compareAtPrice !== undefined && cheapest.compareAtPrice > price;
  const sizeCount = distinctSizes(product).length;
  const hasSizeChoice = sizeCount > 1;

  /* One card per flavour, so the card says which strengths it comes in. */
  const strengths = heatLevels(product);
  const name = product.name;

  return (
    <Card
      className={cn(
        "group relative gap-0 py-0 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-ring hover:shadow-card-hover",
        className,
      )}
    >
      {/* Square so the landscape case shots keep their scale beside the jars. */}
      <div className="relative aspect-square overflow-hidden bg-white">
        {/* The pool of shadow the jar stands in. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-[22%] bottom-[14%] h-3 rounded-[50%] bg-ink/20 blur-md"
        />
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
            "object-contain p-8 drop-shadow-[0_10px_12px_rgb(74_20_20/0.18)] transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
            !inStock && "opacity-50",
          )}
        />

        {(isNew ||
          isBestSeller ||
          isDiscounted ||
          !inStock ||
          bundleItems?.length) && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {!inStock ? (
              <Badge variant="secondary">Out of stock</Badge>
            ) : (
              <>
                {isBestSeller ? <Badge>Bestseller</Badge> : null}
                {isNew ? <Badge variant="outline">New</Badge> : null}
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
        <h3 className="text-base leading-snug font-bold text-brand">
          <Link
            href={routes.product(product.slug)}
            className="decoration-1 underline-offset-4 group-hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {name}
          </Link>
        </h3>
        {strengths.length > 0 ? (
          <p className="mt-1 text-sm font-medium text-brand">
            {strengths.map((level) => heatLabels[level]).join(" · ")}
          </p>
        ) : null}

        <p className="mt-2 line-clamp-2 text-sm text-pretty text-muted-foreground">
          {product.summary}
        </p>

        <DietaryBadges
          variant="card"
          dietary={product.dietary}
          allergens={product.allergens}
          className="mt-3"
        />

        <div className="mt-5 flex items-baseline gap-2">
          <span data-numeric className="text-lg font-bold">
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
            {hasSizeChoice ? `${sizeCount} sizes` : variants[0].size}
          </span>
        </div>

        <div className="relative z-10 mt-4">
          <CardAddToCart product={product} />
        </div>
      </div>
    </Card>
  );
}

import { ProductCard } from "@/components/commerce/product-card";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";

type ProductGridProps = {
  products: ProductSummary[];
  /**
   * How many leading cards load eagerly. Keep this low: the grid is a single
   * column on mobile, so a high count preloads images that are well below the
   * fold on exactly the devices least able to afford it. 0 (browser-managed
   * lazy loading) is the right default for anything but the first screen.
   */
  eagerCount?: number;
  /** Shown instead of the grid when there are no products. */
  empty?: React.ReactNode;
  className?: string;
};

/**
 * The canonical product listing. `ProductCard`'s default `sizes` is tuned to
 * these breakpoints, so overriding the column count means overriding `sizes`.
 */
export function ProductGrid({
  products,
  eagerCount = 0,
  empty,
  className,
}: ProductGridProps) {
  if (products.length === 0) {
    return empty ?? null;
  }

  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.id} className="flex">
          <ProductCard
            product={product}
            eager={index < eagerCount}
            className="w-full"
          />
        </li>
      ))}
    </ul>
  );
}

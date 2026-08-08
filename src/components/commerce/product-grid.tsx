import { ProductCard } from "@/components/commerce/product-card";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";

type ProductGridProps = {
  products: ProductSummary[];
  /** Keep low: the grid is single-column on mobile, so a high count fetches below-the-fold images. */
  eagerCount?: number;
  empty?: React.ReactNode;
  className?: string;
};

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

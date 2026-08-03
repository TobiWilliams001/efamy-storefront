import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Mirrors `ProductCard`'s box model exactly — same aspect ratio, same padding,
 * same line count — so streaming a grid in doesn't shift the layout.
 */
export function ProductCardSkeleton() {
  return (
    <Card className="gap-0 py-0">
      <Skeleton className="aspect-4/5 rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-2 h-5 w-20" />
      </div>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

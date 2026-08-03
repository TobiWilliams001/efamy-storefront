import { ProductGridSkeleton } from "@/components/commerce/product-card-skeleton";
import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <Section>
      <div className="mb-10 sm:mb-12">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-3 h-10 w-72" />
        <Skeleton className="mt-4 h-5 w-full max-w-md" />
      </div>
      <ProductGridSkeleton />
    </Section>
  );
}

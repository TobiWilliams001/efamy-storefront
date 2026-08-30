import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the product page: gallery on the left, details on the right. */
export default function ProductLoading() {
  return (
    <Section spacing="afterHeader">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-square w-full rounded-lg" />

        <div className="min-w-0">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-9 w-3/4" />
          <Skeleton className="mt-4 h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-2/3" />
          <Skeleton className="mt-8 h-8 w-28" />

          <div className="mt-8 flex flex-wrap gap-3">
            <Skeleton className="h-11 w-20 rounded-full" />
            <Skeleton className="h-11 w-20 rounded-full" />
            <Skeleton className="h-11 w-20 rounded-full" />
            <Skeleton className="h-11 w-20 rounded-full" />
          </div>

          <Skeleton className="mt-8 h-13 w-full rounded-full" />
        </div>
      </div>
    </Section>
  );
}

import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the recipe page: photograph and method, with the product aside. */
export default function RecipeLoading() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="max-w-2xl min-w-0">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="mt-8 h-8 w-2/3" />
          <Skeleton className="mt-4 h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-5/6" />

          <div className="mt-10 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </div>

        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </Section>
  );
}

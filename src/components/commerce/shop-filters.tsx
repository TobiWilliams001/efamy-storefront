import Link from "next/link";

import { SortSelect } from "@/components/commerce/sort-select";
import {
  buildQuery,
  heatOptions,
  type ProductFilters,
} from "@/lib/product-filters";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";

type FilterChipProps = {
  href: string;
  active: boolean;
  children: React.ReactNode;
};

function FilterChip({ href, active, children }: FilterChipProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

type ShopFiltersProps = {
  categories: ProductCategory[];
  filters: ProductFilters;
  /** Omitted on category pages, where the category is fixed by the route. */
  showCategories?: boolean;
};

export function ShopFilters({
  categories,
  filters,
  showCategories = true,
}: ShopFiltersProps) {
  return (
    <div className="mb-10 flex flex-col gap-5 border-b pb-6">
      {showCategories ? (
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            href={buildQuery(filters, { category: undefined })}
            active={!filters.category}
          >
            All
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category.slug}
              href={buildQuery(filters, { category: category.slug })}
              active={filters.category === category.slug}
            >
              {category.name}
            </FilterChip>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Heat</span>
          <FilterChip
            href={buildQuery(filters, { heat: undefined })}
            active={!filters.heat}
          >
            Any
          </FilterChip>
          {heatOptions.map((band) => (
            <FilterChip
              key={band.value}
              href={buildQuery(filters, { heat: band.value })}
              active={filters.heat === band.value}
            >
              {band.label}
            </FilterChip>
          ))}
        </div>
        <SortSelect value={filters.sort} />
      </div>
    </div>
  );
}

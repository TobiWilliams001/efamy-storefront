import Link from "next/link";

import { SortSelect } from "@/components/commerce/sort-select";
import {
  buildQuery,
  dietaryOptions,
  heatOptions,
  type ProductFilters,
} from "@/lib/product-filters";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";

type ChipProps = {
  href: string;
  active: boolean;
  size?: "lg" | "sm";
  children: React.ReactNode;
};

function FilterChip({ href, active, size = "lg", children }: ChipProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        size === "lg" ? "h-11 px-6 text-sm" : "h-9 px-4 text-sm",
        active
          ? "border-brand bg-brand text-white"
          : "border-neutral-300 bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
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
  count: number;
};

export function ShopFilters({
  categories,
  filters,
  showCategories = true,
  count,
}: ShopFiltersProps) {
  return (
    <div className="mb-12">
      {showCategories ? (
        <div className="flex flex-wrap justify-center gap-3">
          <FilterChip
            href={buildQuery(filters, { category: undefined })}
            active={!filters.category}
          >
            All products
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

      <div
        className={cn(
          "flex flex-col items-center justify-between gap-5 sm:flex-row",
          showCategories && "mt-8",
        )}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-sm text-muted-foreground">Heat</span>
          <FilterChip
            size="sm"
            href={buildQuery(filters, { heat: undefined })}
            active={!filters.heat}
          >
            Any
          </FilterChip>
          {heatOptions.map((option) => (
            <FilterChip
              key={option.value}
              size="sm"
              href={buildQuery(filters, { heat: option.value })}
              active={filters.heat === option.value}
            >
              {option.label}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-sm text-muted-foreground">Diet</span>
          <FilterChip
            size="sm"
            href={buildQuery(filters, { dietary: undefined })}
            active={!filters.dietary}
          >
            Any
          </FilterChip>
          {dietaryOptions.map((option) => (
            <FilterChip
              key={option.value}
              size="sm"
              href={buildQuery(filters, { dietary: option.value })}
              active={filters.dietary === option.value}
            >
              {option.label}
            </FilterChip>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <p data-numeric className="text-sm text-muted-foreground">
            {count} {count === 1 ? "product" : "products"}
          </p>
          <SortSelect value={filters.sort} />
        </div>
      </div>
    </div>
  );
}

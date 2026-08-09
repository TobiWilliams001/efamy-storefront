import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

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
        size === "lg" ? "h-11 px-6 text-sm" : "h-11 px-4 text-sm sm:h-9",
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
  const activeCount = [filters.heat, filters.dietary].filter(Boolean).length;

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

      {/*
       * On a phone the heat and diet rows pushed every product below the fold,
       * so they collapse behind a disclosure. `details` keeps this working with
       * no JavaScript, and the desktop copy is a separate branch because only
       * one of the two is ever displayed — `hidden` keeps the other out of the
       * accessibility tree entirely.
       */}
      <div
        className={cn(
          "flex items-center justify-between gap-4 sm:hidden",
          showCategories && "mt-6",
        )}
      >
        <details className="group">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-neutral-300 bg-card px-5 text-sm font-medium">
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            Filters
            {activeCount > 0 ? (
              <span
                data-numeric
                className="rounded-full bg-brand px-1.5 text-xs text-white"
              >
                {activeCount}
              </span>
            ) : null}
          </summary>

          <div className="mt-4 space-y-4">
            <HeatFilters filters={filters} />
            <DietFilters filters={filters} />
          </div>
        </details>

        <div className="flex items-center gap-3">
          <p data-numeric className="text-sm text-muted-foreground">
            {count}
            <span className="sr-only">
              {" "}
              {count === 1 ? "product" : "products"}
            </span>
          </p>
          <SortSelect value={filters.sort} />
        </div>
      </div>

      <div
        className={cn(
          "hidden items-center justify-between gap-5 sm:flex",
          showCategories && "mt-8",
        )}
      >
        <HeatFilters filters={filters} />
        <DietFilters filters={filters} />

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

function HeatFilters({ filters }: { filters: ProductFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
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
  );
}

function DietFilters({ filters }: { filters: ProductFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
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
  );
}

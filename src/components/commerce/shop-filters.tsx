import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import { SortSelect } from "@/components/commerce/sort-select";
import {
  buildQuery,
  type AvailableOptions,
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
  /** Only the options the catalogue can actually satisfy. */
  options: AvailableOptions;
  count: number;
};

export function ShopFilters({
  categories,
  filters,
  showCategories = true,
  options,
  count,
}: ShopFiltersProps) {
  const activeCount = [filters.heat, filters.dietary, filters.price].filter(
    Boolean,
  ).length;

  return (
    <div className="mb-12">
      {showCategories ? (
        <div className="flex flex-wrap gap-3">
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
            <HeatFilters filters={filters} options={options.heat} />
            <PriceFilters filters={filters} options={options.price} />
            <DietFilters filters={filters} options={options.dietary} />
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

      {/*
       * The three groups wrap as whole groups rather than as loose chips: each
       * is nowrap on desktop, so a narrow viewport drops "Diet" onto its own
       * line instead of stranding "Extra hot" under "Heat".
       */}
      <div
        className={cn(
          "hidden items-start justify-between gap-6 sm:flex",
          showCategories && "mt-8",
        )}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <HeatFilters filters={filters} options={options.heat} />
          <PriceFilters filters={filters} options={options.price} />
          <DietFilters filters={filters} options={options.dietary} />
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <p
            data-numeric
            className="text-sm whitespace-nowrap text-muted-foreground"
          >
            {count} {count === 1 ? "product" : "products"}
          </p>
          <SortSelect value={filters.sort} />
        </div>
      </div>
    </div>
  );
}

/*
 * The reset chip carries the group's name — "All prices" rather than a bare
 * "Any" under a grey "Price" caption. Three chips all reading "Any" told the
 * customer nothing about which one they were about to press, and dropping the
 * captions buys back the width the row needs to stay on one line.
 */
function PriceFilters({
  filters,
  options,
}: {
  filters: ProductFilters;
  options: AvailableOptions["price"];
}) {
  if (options.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Price"
      className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
    >
      <FilterChip
        size="sm"
        href={buildQuery(filters, { price: undefined })}
        active={!filters.price}
      >
        All prices
      </FilterChip>
      {options.map((option) => (
        <FilterChip
          key={option.value}
          size="sm"
          href={buildQuery(filters, { price: option.value })}
          active={filters.price === option.value}
        >
          {option.label}
        </FilterChip>
      ))}
    </div>
  );
}

function HeatFilters({
  filters,
  options,
}: {
  filters: ProductFilters;
  options: AvailableOptions["heat"];
}) {
  if (options.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Heat"
      className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
    >
      <FilterChip
        size="sm"
        href={buildQuery(filters, { heat: undefined })}
        active={!filters.heat}
      >
        All heats
      </FilterChip>
      {options.map((option) => (
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

function DietFilters({
  filters,
  options,
}: {
  filters: ProductFilters;
  options: AvailableOptions["dietary"];
}) {
  if (options.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Diet"
      className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
    >
      <FilterChip
        size="sm"
        href={buildQuery(filters, { dietary: undefined })}
        active={!filters.dietary}
      >
        All diets
      </FilterChip>
      {options.map((option) => (
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

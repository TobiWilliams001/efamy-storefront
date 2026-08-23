import Link from "next/link";
import { Check, ChevronDown, X } from "lucide-react";

import { DismissMenus } from "@/components/commerce/dismiss-menus";
import {
  shopHref,
  sortOptions,
  type AvailableOptions,
  type ProductFilters,
} from "@/lib/product-filters";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";

type Option = { value: string; label: string };

/**
 * Heat stays on the page while price and diet fold away.
 *
 * Not a stylistic split: heat is two options and the first thing anyone asks of
 * a chilli brand, so a click to reach it is a click too many. Price and diet
 * are the ones people filter by occasionally, and hiding them is what buys the
 * row its quiet.
 */
function Segmented({
  filters,
  options,
  active,
  label,
  param,
}: {
  filters: ProductFilters;
  options: readonly Option[];
  active: string | undefined;
  label: string;
  param: "heat";
}) {
  const all = [{ value: "", label: "All" }, ...options];

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-full border border-neutral-200 p-0.5"
    >
      {all.map((option) => {
        const on = option.value ? active === option.value : !active;
        const href = shopHref(filters, {
          [param]: option.value || undefined,
        } as Partial<ProductFilters>);

        return (
          <Link
            key={option.value || "all"}
            href={href}
            aria-current={on ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full px-4 text-sm transition-colors sm:min-h-8 sm:px-3.5",
              on
                ? "bg-brand font-medium text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * A disclosure rather than a listbox, so the menu opens and the links inside
 * navigate with no JavaScript at all. `DismissMenus` adds the outside click
 * and Escape handling a native select gives you for free; without it the menu
 * still closes when an option is chosen.
 */
function Menu({
  filters,
  options,
  active,
  label,
  param,
  align = "start",
}: {
  filters: ProductFilters;
  options: readonly Option[];
  active: string | undefined;
  label: string;
  param: "price" | "dietary" | "sort";
  align?: "start" | "end";
}) {
  const chosen = options.find((option) => option.value === active);

  return (
    <details data-filter-menu className="relative">
      <summary
        className={cn(
          "inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-full border px-4 text-sm transition-colors sm:min-h-9 sm:px-3.5",
          chosen
            ? "border-brand text-brand"
            : "border-neutral-200 text-muted-foreground hover:text-foreground",
        )}
      >
        {chosen ? chosen.label : label}
        <ChevronDown aria-hidden="true" className="size-3.5" />
      </summary>

      {/* Tapping the scrim closes the sheet; DismissMenus watches for it. */}
      <span
        data-menu-scrim
        aria-hidden="true"
        className="fixed inset-0 z-20 bg-ink/20 sm:hidden"
      />

      <div
        className={cn(
          "z-30 border-neutral-200 bg-card shadow-card-hover",
          "animate-in duration-150 fade-in-0",
          // A bottom sheet on a phone, a popover from the button on desktop.
          "fixed inset-x-0 bottom-0 rounded-t-2xl border-t p-2 slide-in-from-bottom-4",
          "sm:absolute sm:inset-x-auto sm:bottom-auto sm:mt-2 sm:max-w-[calc(100vw-2rem)]",
          "sm:min-w-44 sm:rounded-lg sm:border sm:p-1 sm:zoom-in-95 sm:slide-in-from-top-1",
          align === "end" ? "sm:right-0" : "sm:left-0",
        )}
      >
        {[{ value: "", label: `All ${label.toLowerCase()}` }, ...options].map(
          (option) => {
            const on = option.value ? active === option.value : !active;

            return (
              <Link
                key={option.value || "all"}
                href={shopHref(filters, {
                  [param]: option.value || undefined,
                } as Partial<ProductFilters>)}
                className="flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-sm hover:bg-neutral-50 sm:min-h-9"
              >
                {option.label}
                {on ? (
                  <Check aria-hidden="true" className="size-3.5 text-brand" />
                ) : null}
              </Link>
            );
          },
        )}
      </div>
    </details>
  );
}

export function ShopFilters({
  categories,
  filters,
  showCategories = true,
  options,
}: {
  categories: ProductCategory[];
  filters: ProductFilters;
  showCategories?: boolean;
  options: AvailableOptions;
}) {
  const applied: { label: string; href: string }[] = [];

  const heatLabel = options.heat.find((o) => o.value === filters.heat)?.label;
  if (heatLabel) {
    applied.push({
      label: heatLabel,
      href: shopHref(filters, { heat: undefined }),
    });
  }

  const priceLabel = options.price.find(
    (o) => o.value === filters.price,
  )?.label;
  if (priceLabel) {
    applied.push({
      label: priceLabel,
      href: shopHref(filters, { price: undefined }),
    });
  }

  const dietLabel = options.dietary.find(
    (o) => o.value === filters.dietary,
  )?.label;
  if (dietLabel) {
    applied.push({
      label: dietLabel,
      href: shopHref(filters, { dietary: undefined }),
    });
  }

  return (
    <div className="mb-10">
      <DismissMenus />

      {showCategories ? (
        <nav aria-label="Product categories" className="border-b">
          <ul className="-mb-px flex gap-x-7 overflow-x-auto whitespace-nowrap">
            {[{ slug: "", name: "All products" }, ...categories].map(
              (entry) => {
                const on = entry.slug
                  ? filters.category === entry.slug
                  : !filters.category;

                return (
                  <li key={entry.slug || "all"}>
                    <Link
                      href={shopHref(filters, {
                        category: entry.slug || undefined,
                      })}
                      aria-current={on ? "page" : undefined}
                      className={cn(
                        "inline-block border-b-2 pb-3 text-sm transition-colors",
                        on
                          ? "border-brand font-medium text-brand"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {entry.name}
                    </Link>
                  </li>
                );
              },
            )}
          </ul>
        </nav>
      ) : null}

      <div
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-3",
          showCategories && "mt-6",
        )}
      >
        {options.heat.length > 0 ? (
          <Segmented
            label="Heat"
            param="heat"
            filters={filters}
            options={options.heat}
            active={filters.heat}
          />
        ) : null}

        {options.price.length > 0 ? (
          <Menu
            label="Price"
            param="price"
            filters={filters}
            options={options.price}
            active={filters.price}
          />
        ) : null}

        {options.dietary.length > 0 ? (
          <Menu
            label="Diet"
            param="dietary"
            filters={filters}
            options={options.dietary}
            active={filters.dietary}
          />
        ) : null}

        <div className="flex w-full justify-end sm:ms-auto sm:w-auto">
          <Menu
            label="Sort"
            param="sort"
            align="end"
            filters={filters}
            options={sortOptions}
            active={filters.sort === "featured" ? undefined : filters.sort}
          />
        </div>
      </div>

      {applied.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {applied.map((entry) => (
            <Link
              key={entry.label}
              href={entry.href}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-neutral-50 pr-3 pl-4 text-sm text-muted-foreground transition-colors hover:text-foreground sm:min-h-8 sm:pr-2 sm:pl-3"
            >
              {entry.label}
              <X aria-hidden="true" className="size-3.5" />
              <span className="sr-only">Remove this filter</span>
            </Link>
          ))}
          <Link
            href={shopHref(filters, {
              heat: undefined,
              price: undefined,
              dietary: undefined,
            })}
            className="ml-1 text-sm underline underline-offset-4 hover:text-foreground"
          >
            Clear all
          </Link>
        </div>
      ) : null}
    </div>
  );
}

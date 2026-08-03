import type { HeatLevel, Product } from "@/types/product";

export const heatBands = [
  { value: "mild", label: "Mild", levels: [1, 2] },
  { value: "medium", label: "Medium", levels: [3] },
  { value: "hot", label: "Hot", levels: [4, 5] },
] as const;

export type HeatBand = (typeof heatBands)[number]["value"];

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];

export type ProductFilters = {
  category?: string;
  heat?: HeatBand;
  sort: SortOption;
};

function isHeatBand(value: unknown): value is HeatBand {
  return heatBands.some((band) => band.value === value);
}

function isSortOption(value: unknown): value is SortOption {
  return sortOptions.some((option) => option.value === value);
}

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseFilters(searchParams: SearchParams): ProductFilters {
  const heat = first(searchParams.heat);
  const sort = first(searchParams.sort);

  return {
    category: first(searchParams.category),
    heat: isHeatBand(heat) ? heat : undefined,
    sort: isSortOption(sort) ? sort : "featured",
  };
}

function matchesHeat(product: Product, band: HeatBand): boolean {
  const levels = heatBands.find((entry) => entry.value === band)?.levels;
  return (
    product.heatLevel !== undefined &&
    (levels as readonly HeatLevel[] | undefined)?.includes(
      product.heatLevel,
    ) === true
  );
}

export function applyFilters(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  const filtered = products.filter((product) => {
    if (filters.category && product.category.slug !== filters.category) {
      return false;
    }
    if (filters.heat && !matchesHeat(product, filters.heat)) {
      return false;
    }
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...filtered].sort((a, b) => b.price - a.price);
    case "name":
      return [...filtered].sort((a, b) =>
        a.name.localeCompare(b.name, "en-GB"),
      );
    default:
      // In-stock first, then the catalogue's own order.
      return [...filtered].sort(
        (a, b) => Number(b.inStock) - Number(a.inStock),
      );
  }
}

export function buildQuery(
  filters: Partial<ProductFilters>,
  overrides: Partial<ProductFilters>,
): string {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (next.category) params.set("category", next.category);
  if (next.heat) params.set("heat", next.heat);
  if (next.sort && next.sort !== "featured") params.set("sort", next.sort);

  const query = params.toString();
  return query ? `?${query}` : "";
}

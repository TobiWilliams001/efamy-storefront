import { inStock, lowestPrice, type Heat, type Product } from "@/types/product";

export const heatOptions = [
  { value: "mild", label: "Mild" },
  { value: "hot", label: "Hot" },
] as const;

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];

export type ProductFilters = {
  category?: string;
  heat?: Heat;
  sort: SortOption;
};

function isHeat(value: unknown): value is Heat {
  return value === "mild" || value === "hot";
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
    heat: isHeat(heat) ? heat : undefined,
    sort: isSortOption(sort) ? sort : "featured",
  };
}

export function applyFilters(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  const filtered = products.filter((product) => {
    if (filters.category && product.category.slug !== filters.category) {
      return false;
    }
    if (filters.heat && product.heat !== filters.heat) {
      return false;
    }
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => lowestPrice(a) - lowestPrice(b));
    case "price-desc":
      return [...filtered].sort((a, b) => lowestPrice(b) - lowestPrice(a));
    case "name":
      return [...filtered].sort((a, b) =>
        a.name.localeCompare(b.name, "en-GB"),
      );
    default:
      return [...filtered].sort(
        (a, b) => Number(inStock(b)) - Number(inStock(a)),
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

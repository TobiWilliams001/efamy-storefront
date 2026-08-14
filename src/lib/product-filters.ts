import {
  inStock,
  isHeat,
  lowestPrice,
  type Heat,
  type Product,
} from "@/types/product";

export const heatOptions = [
  { value: "mild", label: "Mild" },
  { value: "hot", label: "Hot" },
  { value: "extra-hot", label: "Extra hot" },
] as const;

/**
 * Only claims printed on the label. Absence of an allergen in our data means
 * it was not transcribed, not that it is absent, so no "gluten free" or
 * "nut free" option is offered — that would be a safety claim we cannot make.
 */
export const dietaryOptions = [
  { value: "vegan", label: "Vegan", claim: "Suitable for vegans" },
  {
    value: "vegetarian",
    label: "Vegetarian",
    claim: "Suitable for vegetarians",
  },
] as const;

export type DietaryOption = (typeof dietaryOptions)[number]["value"];

/**
 * Bands rather than a slider: prices run £2.75 to £12.50, so three bands cover
 * the range without a control that is fiddly on a phone. `max` is exclusive.
 *
 * Matched against every size, not just the cheapest. A sauce sold in four sizes
 * spans £3.25 to £12.50 — banding it on £3.25 alone would put the whole
 * catalogue in "under £5" and leave the other two bands permanently empty.
 */
export const priceOptions = [
  { value: "under-5", label: "Under £5", min: 0, max: 500 },
  { value: "5-10", label: "£5 to £10", min: 500, max: 1000 },
  { value: "over-10", label: "£10 and over", min: 1000, max: Infinity },
] as const;

export type PriceOption = (typeof priceOptions)[number]["value"];

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
  dietary?: DietaryOption;
  price?: PriceOption;
  sort: SortOption;
};

function isDietary(value: unknown): value is DietaryOption {
  return dietaryOptions.some((option) => option.value === value);
}

function isPrice(value: unknown): value is PriceOption {
  return priceOptions.some((option) => option.value === value);
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
  const dietary = first(searchParams.dietary);
  const price = first(searchParams.price);

  return {
    category: first(searchParams.category),
    heat: isHeat(heat) ? heat : undefined,
    dietary: isDietary(dietary) ? dietary : undefined,
    price: isPrice(price) ? price : undefined,
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
    if (
      filters.heat &&
      !product.variants.some((variant) => variant.heat === filters.heat)
    ) {
      return false;
    }
    if (filters.dietary) {
      const claim = dietaryOptions.find(
        (option) => option.value === filters.dietary,
      )?.claim;
      if (!claim || !product.dietary?.includes(claim)) return false;
    }
    if (filters.price) {
      const band = priceOptions.find(
        (option) => option.value === filters.price,
      );
      if (!band) return false;
      const inBand = product.variants.some(
        (variant) => variant.price >= band.min && variant.price < band.max,
      );
      if (!inBand) return false;
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
  if (next.dietary) params.set("dietary", next.dietary);
  if (next.price) params.set("price", next.price);
  if (next.sort && next.sort !== "featured") params.set("sort", next.sort);

  const query = params.toString();
  return query ? `?${query}` : "";
}

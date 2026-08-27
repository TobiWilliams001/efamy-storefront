import { routes } from "@/lib/routes";
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

/**
 * The options worth offering, given what is actually in the catalogue.
 *
 * A chip that matches nothing is worse than no chip: it invites a click that
 * empties the shop and makes the range look smaller than it is.
 *
 * Derived rather than hard-coded, so a strength or a claim the client starts
 * stocking brings its chip back with no code change, and one they drop takes
 * its chip with it. Extra hot has been on both sides of that: absent while no
 * product carried it, back the moment three did.
 *
 * Counted against the whole catalogue rather than the current selection, so
 * chips never disappear out from under the customer mid-filter.
 */
export function availableOptions(products: Product[]) {
  return {
    heat: heatOptions.filter((option) =>
      products.some((product) =>
        product.variants.some((variant) => variant.heat === option.value),
      ),
    ),
    dietary: dietaryOptions.filter((option) =>
      products.some((product) => product.dietary?.includes(option.claim)),
    ),
    price: priceOptions.filter((option) =>
      products.some((product) =>
        product.variants.some(
          (variant) =>
            variant.price >= option.min && variant.price < option.max,
        ),
      ),
    ),
  };
}

export type AvailableOptions = ReturnType<typeof availableOptions>;

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

/**
 * Shows the jar the customer asked for.
 *
 * A card renders the product's own photograph, which is one strength of
 * several. Filtering to Hot and being shown the mild jar reads as the wrong
 * product, and mild and hot differ by the word on the label, so nothing on the
 * card corrects the impression.
 *
 * Only swaps where a photograph of that strength exists; otherwise the product
 * image stands, which is honest about what we have rather than showing nothing.
 */
function withHeatImage(product: Product, heat: Heat): Product {
  const match = product.variants.find(
    (variant) => variant.heat === heat && variant.image,
  );

  return match?.image ? { ...product, image: match.image } : product;
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

  const heat = filters.heat;
  const shown = heat
    ? filtered.map((product) => withHeatImage(product, heat))
    : filtered;

  switch (filters.sort) {
    case "price-asc":
      return [...shown].sort((a, b) => lowestPrice(a) - lowestPrice(b));
    case "price-desc":
      return [...shown].sort((a, b) => lowestPrice(b) - lowestPrice(a));
    case "name":
      return [...shown].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
    default:
      return [...shown].sort((a, b) => Number(inStock(b)) - Number(inStock(a)));
  }
}

/**
 * A complete link to the shop with these filters applied.
 *
 * Returns a path, never a bare query string. `?a=b` and `""` are *relative*
 * references: the empty one resolves to the current URL, query included, so a
 * "clear this filter" link built that way navigates straight back to the page
 * you are already on. That is how clearing the last remaining filter silently
 * did nothing.
 */
export function shopHref(
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
  return query ? `${routes.shop}?${query}` : routes.shop;
}

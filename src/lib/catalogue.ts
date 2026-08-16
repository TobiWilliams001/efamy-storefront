import {
  bestSellerSlugs,
  categories as staticCategories,
  featuredSlugs,
  products as staticProducts,
} from "@/lib/catalogue-data";
import { recipes as staticRecipes, type Recipe } from "@/lib/recipes";
import { getSanityClient } from "@/sanity/client";
import { mapCategory, mapProduct } from "@/sanity/map";
import { mapRecipe } from "@/sanity/map-recipe";
import {
  BEST_SELLERS_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  FEATURED_PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCTS_QUERY,
  RECIPE_BY_SLUG_QUERY,
  RECIPES_QUERY,
} from "@/sanity/queries";
import type { Product, ProductCategory } from "@/types/product";

// The single seam between the site and its content source.

const CACHE = { next: { revalidate: 60, tags: ["catalogue"] } };

async function fetchFromSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, CACHE);
  } catch (error) {
    // A CMS outage should degrade to the static catalogue, not take the shop
    // down. See docs/payments.md: external failures degrade, never destroy.
    console.error("Sanity fetch failed, falling back to static data", error);
    return null;
  }
}

function mapProducts(raw: Record<string, unknown>[] | null): Product[] {
  return (raw ?? [])
    .map(mapProduct)
    .filter((entry): entry is Product => entry !== null);
}

/**
 * Sanity augments the bundled catalogue rather than replacing it.
 *
 * The dataset starts empty and gets filled one document at a time. Replacing
 * would mean the first product created in the Studio takes the shop from
 * seventeen products to one. Merging by slug lets the Studio be filled at any
 * pace: a Sanity document wins wherever its slug matches, unseen slugs are
 * appended, and anything not yet entered keeps its bundled entry.
 *
 * Bundled order is preserved so the curated shop order does not shuffle as
 * documents appear.
 */
function mergeBySlug<T extends { slug: string }>(
  base: readonly T[],
  overrides: readonly T[],
): T[] {
  const bySlug = new Map(overrides.map((entry) => [entry.slug, entry]));
  const baseSlugs = new Set(base.map((entry) => entry.slug));

  return [
    ...base.map((entry) => bySlug.get(entry.slug) ?? entry),
    ...overrides.filter((entry) => !baseSlugs.has(entry.slug)),
  ];
}

/** The static catalogue curates by slug; Sanity carries a flag per product. */
function markBestSellers(products: Product[]): Product[] {
  return products.map((product) =>
    bestSellerSlugs.includes(product.slug)
      ? { ...product, isBestSeller: true }
      : product,
  );
}

/**
 * A curated row: whatever Sanity flags, topped up from the bundled curation
 * until the row is full.
 *
 * The top-up is resolved through the merged catalogue rather than the static
 * array, so a product the client has since edited in the Studio shows its
 * current content even when the slug that selected it is a bundled one.
 */
async function curatedRow(
  query: string,
  slugs: readonly string[],
  limit: number,
): Promise<Product[]> {
  const raw = await fetchFromSanity<Record<string, unknown>[]>(query, {
    limit,
  });
  const flagged = mapProducts(raw);
  if (flagged.length >= limit) return flagged.slice(0, limit);

  const chosen = new Set(flagged.map((product) => product.slug));
  const all = await getProducts();
  const topUp = slugs
    .filter((slug) => !chosen.has(slug))
    .map((slug) => all.find((product) => product.slug === slug))
    .filter((product): product is Product => product !== undefined);

  return [...flagged, ...topUp].slice(0, limit);
}

export async function getCategories(): Promise<ProductCategory[]> {
  const raw =
    await fetchFromSanity<Record<string, unknown>[]>(CATEGORIES_QUERY);
  const mapped = (raw ?? [])
    .map(mapCategory)
    .filter((entry): entry is ProductCategory => entry !== null);
  return mergeBySlug(staticCategories, mapped);
}

export async function getProducts(): Promise<Product[]> {
  const raw = await fetchFromSanity<Record<string, unknown>[]>(PRODUCTS_QUERY);
  return mergeBySlug(markBestSellers(staticProducts), mapProducts(raw));
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return curatedRow(FEATURED_PRODUCTS_QUERY, featuredSlugs, limit);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  return curatedRow(BEST_SELLERS_QUERY, bestSellerSlugs, limit);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const raw = await fetchFromSanity<Record<string, unknown> | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
  );
  const mapped = raw ? mapProduct(raw) : null;
  return (
    mapped ??
    staticProducts.find((product) => product.slug === slug) ??
    undefined
  );
}

export async function getCategoryBySlug(
  slug: string,
): Promise<ProductCategory | undefined> {
  const raw = await fetchFromSanity<Record<string, unknown> | null>(
    CATEGORY_BY_SLUG_QUERY,
    { slug },
  );
  const mapped = raw ? mapCategory(raw) : null;
  return (
    mapped ??
    staticCategories.find((category) => category.slug === slug) ??
    undefined
  );
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.category.slug === product.category.slug,
    )
    .slice(0, limit);
}

/*
 * Recipes follow the same rule as products: Sanity when it answers, the bundled
 * set when it does not. The static six are drafts and are meant to be replaced
 * from the Studio — once real recipes exist there, these stop being reachable.
 */
export async function getRecipes(): Promise<Recipe[]> {
  const raw = await fetchFromSanity<Record<string, unknown>[]>(RECIPES_QUERY);
  const mapped = raw
    ?.map(mapRecipe)
    .filter((entry): entry is Recipe => entry !== null);

  return mapped && mapped.length > 0 ? mapped : staticRecipes;
}

export async function getRecipe(slug: string): Promise<Recipe | undefined> {
  const raw = await fetchFromSanity<Record<string, unknown>>(
    RECIPE_BY_SLUG_QUERY,
    { slug },
  );
  const mapped = raw ? mapRecipe(raw) : null;

  return mapped ?? staticRecipes.find((recipe) => recipe.slug === slug);
}

export async function getRecipesForProduct(
  productSlug: string,
): Promise<Recipe[]> {
  const all = await getRecipes();
  return all.filter((recipe) => recipe.productSlug === productSlug);
}

import {
  bestSellerSlugs,
  categories as staticCategories,
  featuredSlugs,
  products as staticProducts,
} from "@/lib/catalogue-data";
import { getSanityClient } from "@/sanity/client";
import { mapCategory, mapProduct } from "@/sanity/map";
import {
  BEST_SELLERS_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  FEATURED_PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCTS_QUERY,
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

function mapProducts(raw: Record<string, unknown>[] | null): Product[] | null {
  if (!raw) return null;
  const mapped = raw
    .map(mapProduct)
    .filter((entry): entry is Product => entry !== null);
  return mapped.length > 0 ? mapped : null;
}

/** The static catalogue curates by slug; Sanity carries a flag per product. */
function markBestSellers(products: Product[]): Product[] {
  return products.map((product) =>
    bestSellerSlugs.includes(product.slug)
      ? { ...product, isBestSeller: true }
      : product,
  );
}

function bySlugs(slugs: readonly string[], limit: number): Product[] {
  return slugs
    .map((slug) => staticProducts.find((product) => product.slug === slug))
    .filter((product): product is Product => product !== undefined)
    .slice(0, limit);
}

export async function getCategories(): Promise<ProductCategory[]> {
  const raw =
    await fetchFromSanity<Record<string, unknown>[]>(CATEGORIES_QUERY);
  const mapped = raw
    ?.map(mapCategory)
    .filter((entry): entry is ProductCategory => entry !== null);
  return mapped?.length ? mapped : staticCategories;
}

export async function getProducts(): Promise<Product[]> {
  const raw = await fetchFromSanity<Record<string, unknown>[]>(PRODUCTS_QUERY);
  return mapProducts(raw) ?? markBestSellers(staticProducts);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const raw = await fetchFromSanity<Record<string, unknown>[]>(
    FEATURED_PRODUCTS_QUERY,
    { limit },
  );
  return mapProducts(raw) ?? bySlugs(featuredSlugs, limit);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  const raw = await fetchFromSanity<Record<string, unknown>[]>(
    BEST_SELLERS_QUERY,
    { limit },
  );
  return mapProducts(raw) ?? bySlugs(bestSellerSlugs, limit);
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

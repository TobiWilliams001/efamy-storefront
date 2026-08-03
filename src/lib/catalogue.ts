import {
  bestSellerSlugs,
  featuredSlugs,
  placeholderCategories,
  placeholderProducts,
} from "@/lib/placeholder-data";
import type { Product, ProductCategory } from "@/types/product";

// Data access seam. Backed by placeholder data until the CMS lands; the async
// signatures are what let that swap happen without touching call sites.

function bySlugs(slugs: readonly string[], limit: number): Product[] {
  return slugs
    .map((slug) => placeholderProducts.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined && p.inStock)
    .slice(0, limit);
}

export async function getCategories(): Promise<ProductCategory[]> {
  return placeholderCategories;
}

export async function getProducts(): Promise<Product[]> {
  return placeholderProducts;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return bySlugs(featuredSlugs, limit);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  return bySlugs(bestSellerSlugs, limit);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return placeholderProducts.find((product) => product.slug === slug);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<ProductCategory | undefined> {
  return placeholderCategories.find((category) => category.slug === slug);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  return placeholderProducts
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.category.slug === product.category.slug,
    )
    .slice(0, limit);
}

import {
  bestSellerSlugs,
  categories,
  featuredSlugs,
  products,
} from "@/lib/catalogue-data";
import type { Product, ProductCategory } from "@/types/product";

// Data access seam. Backed by the static catalogue until the CMS lands; the
// async signatures are what let that swap happen without touching call sites.

function bySlugs(slugs: readonly string[], limit: number): Product[] {
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => product !== undefined)
    .slice(0, limit);
}

export async function getCategories(): Promise<ProductCategory[]> {
  return categories;
}

export async function getProducts(): Promise<Product[]> {
  return products;
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
  return products.find((product) => product.slug === slug);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<ProductCategory | undefined> {
  return categories.find((category) => category.slug === slug);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.category.slug === product.category.slug,
    )
    .slice(0, limit);
}

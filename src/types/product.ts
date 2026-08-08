export type ProductImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

/** Matches the packaging, which is labelled Mild or Hot and nothing finer. */
export type Heat = "mild" | "hot";

export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: ProductImage;
  productCount?: number;
};

/**
 * One purchasable size of a product. Sauces come in four, seasonings in one.
 * Price lives here, never on the product, because it differs per size.
 */
export type ProductVariant = {
  /** Net weight as printed on the jar, e.g. "250g". Identifies the variant. */
  size: string;
  /** Minor units (pence). Format with `formatPrice()`. */
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  /** Ordered smallest to largest. Always at least one. */
  variants: ProductVariant[];
  heat?: Heat;
  /** Transcribed from the label. Legally required, so never guess these. */
  ingredients?: string[];
  allergens?: string[];
  dietary?: string[];
  storage?: string;
  servingSuggestions?: string[];
  nutrition?: { label: string; value: string }[];
  image: ProductImage;
  images?: ProductImage[];
  category: Pick<ProductCategory, "slug" | "name">;
  /** Populated only for multipacks and gift sets. */
  bundleItems?: { slug: string; name: string }[];
  isNew?: boolean;
};

export type ProductSummary = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "summary"
  | "variants"
  | "heat"
  | "image"
  | "category"
  | "dietary"
  | "allergens"
  | "bundleItems"
  | "isNew"
>;

/** Lowest price across variants, for "from £x" on cards and price sorting. */
export function lowestPrice(product: Pick<Product, "variants">): number {
  return Math.min(...product.variants.map((variant) => variant.price));
}

export function inStock(product: Pick<Product, "variants">): boolean {
  return product.variants.some((variant) => variant.inStock);
}

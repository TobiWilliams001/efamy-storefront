export type ProductImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

/** Matches the packaging, which is labelled Mild or Hot and nothing finer. */
export type Heat = "mild" | "hot" | "extra-hot";

export function isHeat(value: unknown): value is Heat {
  return value === "mild" || value === "hot" || value === "extra-hot";
}

export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: ProductImage;
  productCount?: number;
};

/**
 * One purchasable jar. A sauce is one product with a variant per strength and
 * size, because that is how a customer shops: they want beef chilli sauce, then
 * decide how hot and how much.
 *
 * Size and heat together identify the variant. Price lives here, never on the
 * product, because it differs per size.
 */
export type ProductVariant = {
  /** Net weight as printed on the jar, e.g. "250g". */
  size: string;
  /** Absent on products sold in a single strength, such as the seasonings. */
  heat?: Heat;
  /** Minor units (pence). Format with `formatPrice()`. */
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
};

/** The strengths a product is actually sold in, in label order. */
export function heatLevels(product: { variants: ProductVariant[] }): Heat[] {
  const order: Heat[] = ["mild", "hot", "extra-hot"];
  const found = new Set(
    product.variants.map((variant) => variant.heat).filter(Boolean) as Heat[],
  );
  return order.filter((level) => found.has(level));
}

/** The sizes available at a given strength, smallest first. */
export function sizesFor(
  product: { variants: ProductVariant[] },
  heat: Heat | undefined,
): ProductVariant[] {
  return product.variants.filter((variant) => variant.heat === heat);
}

export type Product = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  /** Ordered smallest to largest. Always at least one. */
  variants: ProductVariant[];
  /** Transcribed from the label. Legally required, so never guess these. */
  ingredients?: string[];
  allergens?: string[];
  dietary?: string[];
  storage?: string;
  /** e.g. "12 months unopened". Sits with storage on the product page. */
  shelfLife?: string;
  /** Scheme names only, e.g. "SALSA", "BRC". Never invent one. */
  certifications?: string[];
  servingSuggestions?: string[];
  nutrition?: { label: string; value: string }[];
  image: ProductImage;
  images?: ProductImage[];
  category: Pick<ProductCategory, "slug" | "name">;
  /** Populated only for multipacks and gift sets. */
  bundleItems?: { slug: string; name: string }[];
  isNew?: boolean;
  isBestSeller?: boolean;
};

export type ProductSummary = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "summary"
  | "variants"
  | "image"
  | "category"
  | "dietary"
  | "allergens"
  | "bundleItems"
  | "isNew"
  | "isBestSeller"
>;

/** Lowest price across variants, for "from £x" on cards and price sorting. */
export function lowestPrice(product: Pick<Product, "variants">): number {
  return Math.min(...product.variants.map((variant) => variant.price));
}

export function inStock(product: Pick<Product, "variants">): boolean {
  return product.variants.some((variant) => variant.inStock);
}

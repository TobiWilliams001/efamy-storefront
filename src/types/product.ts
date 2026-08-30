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
  /**
   * The jar for this strength, where the label differs. Falls back to the
   * product image, so only strengths with their own photograph need one.
   */
  image?: ProductImage;
  /** Minor units (pence). Format with `formatPrice()`. */
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  /**
   * How many are left, when Efamy is counting this size. Undefined means they
   * are not: availability then rests on `inStock` alone, which is the manual
   * toggle. Zero is a real answer and means sold out.
   */
  stock?: number;
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
/**
 * How many different jars this is sold in.
 *
 * Not the number of variants: a sauce made mild, hot and extra hot in four
 * sizes has twelve variants and four sizes. Counting variants told a customer
 * Beef came in "12 sizes", which is not a thing anybody sells.
 */
export function distinctSizes(product: {
  variants: ProductVariant[];
}): string[] {
  return [...new Set(product.variants.map((variant) => variant.size))];
}

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

/**
 * Whether a single size can be bought.
 *
 * The count wins where there is one, because it is the fact; the toggle is the
 * override for sizes nobody is counting. A size can therefore be switched off
 * by hand while still holding stock, but never sold while at zero.
 */
export function variantAvailable(variant: ProductVariant): boolean {
  if (!variant.inStock) return false;
  return variant.stock === undefined || variant.stock > 0;
}

export function inStock(product: Pick<Product, "variants">): boolean {
  return product.variants.some(variantAvailable);
}

/** Low enough to be worth telling the customer, and only when it is real. */
export const LOW_STOCK_AT = 5;

export function isLowStock(variant: ProductVariant): boolean {
  return (
    variantAvailable(variant) &&
    variant.stock !== undefined &&
    variant.stock <= LOW_STOCK_AT
  );
}

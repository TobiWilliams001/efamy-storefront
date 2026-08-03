/**
 * Domain types for the catalogue.
 *
 * These are deliberately CMS-agnostic. When a headless CMS is chosen we write a
 * mapper from its response shape into these types in the data-access layer —
 * components keep rendering `Product` and never learn where it came from.
 */

export type ProductImage = {
  url: string;
  /** Describes the product, not the photograph. Never leave this empty. */
  alt: string;
  width: number;
  height: number;
  /** Base64 placeholder, if the CMS can generate one. */
  blurDataURL?: string;
};

/** 1 = mild, 5 = very hot. Chilli heat is a primary browse and filter axis. */
export type HeatLevel = 1 | 2 | 3 | 4 | 5;

export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: ProductImage;
  /** Populated by the data layer; omitted where a count would be misleading. */
  productCount?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** One line, used on cards and in listings. Keep it under ~80 characters. */
  summary: string;
  description: string;
  /** Minor units (pence) — never a float. Format with `formatPrice()`. */
  price: number;
  /** Original price when discounted, also in pence. */
  compareAtPrice?: number;
  /** Net contents as sold, e.g. "250ml" or "80g". */
  size: string;
  heatLevel?: HeatLevel;
  image: ProductImage;
  /** Additional shots for the product detail gallery. */
  images?: ProductImage[];
  category: Pick<ProductCategory, "slug" | "name">;
  inStock: boolean;
  isNew?: boolean;
};

/** Cards and listings only need a subset — accept the narrowest shape that works. */
export type ProductSummary = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "summary"
  | "price"
  | "compareAtPrice"
  | "size"
  | "heatLevel"
  | "image"
  | "category"
  | "inStock"
  | "isNew"
>;

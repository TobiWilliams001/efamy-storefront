export type ProductImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

/** 1 = mild, 5 = very hot. */
export type HeatLevel = 1 | 2 | 3 | 4 | 5;

export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: ProductImage;
  productCount?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  /** Minor units (pence). Format with `formatPrice()`. */
  price: number;
  compareAtPrice?: number;
  /** Net contents as sold, e.g. "250ml". */
  size: string;
  heatLevel?: HeatLevel;
  image: ProductImage;
  images?: ProductImage[];
  category: Pick<ProductCategory, "slug" | "name">;
  inStock: boolean;
  isNew?: boolean;
};

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

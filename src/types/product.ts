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

export type Product = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  /** Minor units (pence). Format with `formatPrice()`. */
  price: number;
  compareAtPrice?: number;
  /** Net contents as printed on the jar, e.g. "250g". */
  size: string;
  heat?: Heat;
  /** Transcribed from the label. Legally required, so never guess these. */
  ingredients?: string[];
  /** Allergens to declare, e.g. "Fish", "Wheat (gluten)". */
  allergens?: string[];
  /** Claims printed on the packaging, e.g. "Suitable for vegans". */
  dietary?: string[];
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
  | "heat"
  | "image"
  | "category"
  | "inStock"
  | "isNew"
>;

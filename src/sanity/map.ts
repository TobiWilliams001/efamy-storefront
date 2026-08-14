import {
  isHeat,
  type Product,
  type ProductCategory,
  type ProductImage,
} from "@/types/product";

// GROQ already projects our field names; this only normalises null to undefined.

type RawImage = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  blurDataURL?: string | null;
};

function mapImage(raw: RawImage | null | undefined): ProductImage | null {
  if (!raw?.url || !raw.width || !raw.height) return null;
  return {
    url: raw.url,
    alt: raw.alt ?? "",
    width: raw.width,
    height: raw.height,
    blurDataURL: raw.blurDataURL ?? undefined,
  };
}

function list(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.length > 0
    ? (value as string[])
    : undefined;
}

export function mapProduct(raw: Record<string, unknown>): Product | null {
  const image = mapImage(raw.image as RawImage);
  const category = raw.category as { slug?: string; name?: string } | null;

  const variants = Array.isArray(raw.variants)
    ? (raw.variants as Record<string, unknown>[])
        .map((entry) => ({
          size: String(entry.size ?? ""),
          heat: isHeat(entry.heat) ? entry.heat : undefined,
          price: Number(entry.price ?? 0),
          compareAtPrice:
            typeof entry.compareAtPrice === "number"
              ? entry.compareAtPrice
              : undefined,
          inStock: entry.inStock !== false,
        }))
        .filter((entry) => entry.size && entry.price > 0)
    : [];

  if (
    !image ||
    !raw.slug ||
    !category?.slug ||
    !category.name ||
    variants.length === 0
  ) {
    return null;
  }

  return {
    id: String(raw.id),
    slug: String(raw.slug),
    name: String(raw.name ?? ""),
    summary: String(raw.summary ?? ""),
    description: String(raw.description ?? ""),
    variants,
    ingredients: list(raw.ingredients),
    allergens: list(raw.allergens),
    dietary: list(raw.dietary),
    storage: typeof raw.storage === "string" ? raw.storage : undefined,
    shelfLife: typeof raw.shelfLife === "string" ? raw.shelfLife : undefined,
    certifications: list(raw.certifications),
    servingSuggestions: list(raw.servingSuggestions),
    nutrition:
      Array.isArray(raw.nutrition) && raw.nutrition.length > 0
        ? (raw.nutrition as { label: string; value: string }[])
        : undefined,
    image,
    images:
      (raw.images as RawImage[] | null)
        ?.map(mapImage)
        .filter((entry): entry is ProductImage => entry !== null) ?? undefined,
    category: { slug: category.slug, name: category.name },
    bundleItems:
      Array.isArray(raw.bundleItems) && raw.bundleItems.length > 0
        ? (raw.bundleItems as { slug: string; name: string }[])
        : undefined,
    isNew: raw.isNew === true ? true : undefined,
    isBestSeller: raw.bestSeller === true ? true : undefined,
  };
}

export function mapCategory(
  raw: Record<string, unknown>,
): ProductCategory | null {
  const image = mapImage(raw.image as RawImage);

  if (!image || !raw.slug) return null;

  return {
    id: String(raw.id),
    slug: String(raw.slug),
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    image,
    productCount:
      typeof raw.productCount === "number" ? raw.productCount : undefined,
  };
}

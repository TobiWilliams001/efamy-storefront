import type { Product, ProductCategory, ProductImage } from "@/types/product";

/**
 * GROQ already projects to our field names, so this only normalises what the
 * Content Lake returns as null into the optional shapes our types expect.
 */

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

  if (!image || !raw.slug || !category?.slug || !category.name) {
    return null;
  }

  return {
    id: String(raw.id),
    slug: String(raw.slug),
    name: String(raw.name ?? ""),
    summary: String(raw.summary ?? ""),
    description: String(raw.description ?? ""),
    price: Number(raw.price ?? 0),
    compareAtPrice:
      typeof raw.compareAtPrice === "number" ? raw.compareAtPrice : undefined,
    size: String(raw.size ?? ""),
    heat: raw.heat === "mild" || raw.heat === "hot" ? raw.heat : undefined,
    ingredients: list(raw.ingredients),
    allergens: list(raw.allergens),
    dietary: list(raw.dietary),
    image,
    images:
      (raw.images as RawImage[] | null)
        ?.map(mapImage)
        .filter((entry): entry is ProductImage => entry !== null) ?? undefined,
    category: { slug: category.slug, name: category.name },
    inStock: raw.inStock === true,
    isNew: raw.isNew === true ? true : undefined,
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

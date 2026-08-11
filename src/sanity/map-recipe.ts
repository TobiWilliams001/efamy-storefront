import type { Recipe } from "@/lib/recipes";

function list(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function positiveInt(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.round(value)
    : fallback;
}

/**
 * Sanity recipe → the shape the site already renders.
 *
 * Returns null for anything unusable rather than a half-built recipe. A recipe
 * missing its method is worse than one that simply is not there.
 */
export function mapRecipe(raw: Record<string, unknown>): Recipe | null {
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  const title = typeof raw.title === "string" ? raw.title : "";
  const ingredients = list(raw.ingredients);
  const method = list(raw.method);

  if (!slug || !title || ingredients.length === 0 || method.length === 0) {
    return null;
  }

  const image = raw.image as { url?: unknown } | null | undefined;

  return {
    slug,
    title,
    summary: typeof raw.summary === "string" ? raw.summary : "",
    productSlug: typeof raw.productSlug === "string" ? raw.productSlug : "",
    serves: positiveInt(raw.serves, 4),
    prepMinutes: positiveInt(raw.prepMinutes, 0),
    cookMinutes: positiveInt(raw.cookMinutes, 0),
    ingredients,
    method,
    image: typeof image?.url === "string" ? image.url : undefined,
  };
}

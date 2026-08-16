import { describe, expect, it } from "vitest";

import { products } from "@/lib/catalogue-data";
import { recipes } from "@/lib/recipes";

describe("recipes", () => {
  /*
   * A recipe names its product by slug, and the page renders nothing at all
   * when that slug misses. Three recipes carried a strength in the slug
   * ("beef-chilli-sauce-hot") from before strength became a variant, so their
   * pages quietly lost the product panel while grilled chicken kept one.
   */
  it("every recipe names a product that exists", () => {
    const slugs = new Set(products.map((product) => product.slug));
    const dangling = recipes
      .filter((recipe) => !slugs.has(recipe.productSlug))
      .map((recipe) => `${recipe.slug} -> ${recipe.productSlug}`);

    expect(dangling).toEqual([]);
  });

  it("every recipe photograph is a real path", () => {
    for (const recipe of recipes) {
      if (recipe.image) {
        expect(recipe.image.startsWith("/")).toBe(true);
      }
    }
  });
});

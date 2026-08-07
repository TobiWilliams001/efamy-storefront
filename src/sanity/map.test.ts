import { describe, expect, it } from "vitest";

import { mapCategory, mapProduct } from "@/sanity/map";

const image = {
  url: "https://cdn.sanity.io/x.jpg",
  alt: "A jar",
  width: 1000,
  height: 1000,
};

const valid = {
  id: "abc",
  slug: "beef-chilli-sauce-hot",
  name: "Beef Chilli Sauce — Hot",
  summary: "Rich and spicy",
  description: "A description",
  variants: [
    { size: "175g", price: 325, inStock: true },
    { size: "800g", price: 1250, inStock: true },
  ],
  image,
  category: { slug: "chilli-sauces", name: "Chilli Sauces" },
};

describe("mapProduct", () => {
  it("maps a complete document", () => {
    const product = mapProduct(valid);
    expect(product).not.toBeNull();
    expect(product!.slug).toBe("beef-chilli-sauce-hot");
    expect(product!.variants).toHaveLength(2);
    expect(product!.variants[0].price).toBe(325);
  });

  // Dropping a broken product is deliberate: a half-rendered product with no
  // price or no image is worse than one missing from the grid.
  it.each([
    ["no image", { ...valid, image: null }],
    ["no slug", { ...valid, slug: undefined }],
    ["no category", { ...valid, category: null }],
    ["no variants", { ...valid, variants: [] }],
  ])("returns null when a document has %s", (_label, doc) => {
    expect(mapProduct(doc as Record<string, unknown>)).toBeNull();
  });

  it("drops variants with no price rather than showing them as free", () => {
    const product = mapProduct({
      ...valid,
      variants: [
        { size: "175g", price: 325, inStock: true },
        { size: "250g", price: 0, inStock: true },
        { size: "500g", price: null, inStock: true },
      ],
    });
    expect(product!.variants).toHaveLength(1);
  });

  it("treats a missing inStock as in stock", () => {
    const product = mapProduct({
      ...valid,
      variants: [{ size: "175g", price: 325 }],
    });
    expect(product!.variants[0].inStock).toBe(true);
  });

  it("turns empty arrays into undefined so sections stay hidden", () => {
    const product = mapProduct({
      ...valid,
      ingredients: [],
      allergens: null,
      nutrition: [],
    });
    expect(product!.ingredients).toBeUndefined();
    expect(product!.allergens).toBeUndefined();
    expect(product!.nutrition).toBeUndefined();
  });

  it("ignores a heat value that is not mild or hot", () => {
    expect(mapProduct({ ...valid, heat: "scorching" })!.heat).toBeUndefined();
    expect(mapProduct({ ...valid, heat: "mild" })!.heat).toBe("mild");
  });

  it("skips additional images that are incomplete", () => {
    const product = mapProduct({
      ...valid,
      images: [image, { url: null }, { url: "/y.jpg" }],
    });
    expect(product!.images).toHaveLength(1);
  });
});

describe("mapCategory", () => {
  it("maps a complete category", () => {
    const category = mapCategory({
      id: "cat",
      slug: "chilli-sauces",
      name: "Chilli Sauces",
      description: "Sauces",
      image,
      productCount: 7,
    });
    expect(category!.slug).toBe("chilli-sauces");
    expect(category!.productCount).toBe(7);
  });

  it("returns null without an image or slug", () => {
    expect(mapCategory({ id: "c", slug: "x", name: "X" })).toBeNull();
    expect(mapCategory({ id: "c", name: "X", image })).toBeNull();
  });
});

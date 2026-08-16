import { describe, expect, it } from "vitest";

import {
  applyFilters,
  availableOptions,
  shopHref,
  parseFilters,
} from "@/lib/product-filters";
import type { Heat, Product } from "@/types/product";

function product(
  slug: string,
  overrides: Partial<Product> & { prices: number[]; heat?: Heat },
): Product {
  const { prices, heat, ...rest } = overrides;
  return {
    id: slug,
    slug,
    name: slug,
    summary: "",
    description: "",
    variants: prices.map((price, index) => ({
      size: `${index}g`,
      heat,
      price,
      inStock: true,
    })),
    image: { url: "/x.jpg", alt: "x", width: 1, height: 1 },
    category: { slug: "chilli-sauces", name: "Chilli Sauces" },
    ...rest,
  };
}

const catalogue: Product[] = [
  product("beef-hot", { prices: [325, 1250], heat: "hot" }),
  product("beans-mild", {
    prices: [275, 1150],
    heat: "mild",
    dietary: ["Suitable for vegetarians", "Suitable for vegans"],
  }),
  product("coat-and-cook", {
    prices: [350],
    category: { slug: "seasonings", name: "Seasonings" },
  }),
];

describe("availableOptions", () => {
  it("drops a strength nothing is sold in", () => {
    const heat = availableOptions(catalogue).heat.map((o) => o.value);

    expect(heat).toEqual(["mild", "hot"]);
    expect(heat).not.toContain("extra-hot");
  });

  it("offers a strength as soon as one product carries it", () => {
    const withExtraHot = [
      ...catalogue,
      product("fire", { prices: [400], heat: "extra-hot" }),
    ];

    expect(availableOptions(withExtraHot).heat.map((o) => o.value)).toContain(
      "extra-hot",
    );
  });

  it("keeps only the dietary claims actually printed on a label", () => {
    expect(availableOptions(catalogue).dietary.map((o) => o.value)).toEqual([
      "vegan",
      "vegetarian",
    ]);
    expect(
      availableOptions([catalogue[0]]).dietary.map((o) => o.value),
    ).toEqual([]);
  });

  it("drops a price band no size falls into", () => {
    const cheap = [product("small", { prices: [199] })];

    expect(availableOptions(cheap).price.map((o) => o.value)).toEqual([
      "under-5",
    ]);
  });

  it("returns nothing at all for an empty catalogue", () => {
    expect(availableOptions([])).toEqual({ heat: [], dietary: [], price: [] });
  });
});

describe("parseFilters", () => {
  it("defaults to featured when nothing is set", () => {
    expect(parseFilters({})).toEqual({
      category: undefined,
      heat: undefined,
      sort: "featured",
    });
  });

  it("ignores values that are not real options", () => {
    const filters = parseFilters({
      heat: "nuclear",
      sort: "cheapest",
      dietary: "carnivore",
    });
    expect(filters.heat).toBeUndefined();
    expect(parseFilters({ heat: "extra-hot" }).heat).toBe("extra-hot");
    expect(filters.sort).toBe("featured");
    expect(filters.dietary).toBeUndefined();
  });

  it("takes the first value when a param is repeated", () => {
    expect(parseFilters({ heat: ["hot", "mild"] }).heat).toBe("hot");
  });
});

describe("applyFilters", () => {
  const base = { sort: "featured" as const };

  it("filters by category", () => {
    const result = applyFilters(catalogue, {
      ...base,
      category: "seasonings",
    });
    expect(result.map((p) => p.slug)).toEqual(["coat-and-cook"]);
  });

  it("filters by heat, excluding products with none", () => {
    const result = applyFilters(catalogue, { ...base, heat: "hot" });
    expect(result.map((p) => p.slug)).toEqual(["beef-hot"]);
  });

  it("sorts by the cheapest variant, not the first", () => {
    const cheap = applyFilters(catalogue, { sort: "price-asc" });
    expect(cheap.map((p) => p.slug)).toEqual([
      "beans-mild",
      "beef-hot",
      "coat-and-cook",
    ]);

    const dear = applyFilters(catalogue, { sort: "price-desc" });
    expect(dear[0].slug).toBe("coat-and-cook");
  });

  it("filters by a dietary claim printed on the label", () => {
    const vegan = applyFilters(catalogue, { ...base, dietary: "vegan" });
    expect(vegan.map((p) => p.slug)).toEqual(["beans-mild"]);
  });

  // Missing allergen data means "not transcribed", never "not present", so a
  // product is only ever included on a claim it actually carries.
  it("excludes products with no dietary claims rather than assuming", () => {
    const vegetarian = applyFilters(catalogue, {
      ...base,
      dietary: "vegetarian",
    });
    expect(vegetarian.map((p) => p.slug)).toEqual(["beans-mild"]);
    expect(vegetarian).toHaveLength(1);
  });

  it("combines dietary with heat", () => {
    expect(
      applyFilters(catalogue, { ...base, dietary: "vegan", heat: "hot" }),
    ).toEqual([]);
  });

  it("returns an empty list rather than throwing when nothing matches", () => {
    expect(
      applyFilters(catalogue, { ...base, category: "does-not-exist" }),
    ).toEqual([]);
  });

  it("does not mutate the input", () => {
    const order = catalogue.map((p) => p.slug);
    applyFilters(catalogue, { sort: "price-desc" });
    expect(catalogue.map((p) => p.slug)).toEqual(order);
  });
});

describe("shopHref", () => {
  it("omits the default sort so clean URLs stay clean", () => {
    expect(shopHref({ sort: "featured" }, {})).toBe("/shop");
  });

  it("keeps other filters when one changes", () => {
    expect(
      shopHref({ category: "seasonings", sort: "featured" }, { heat: "hot" }),
    ).toBe("/shop?category=seasonings&heat=hot");
  });

  /*
   * The bug this guards: returning "" for "no filters left" produced an empty
   * href, which a browser resolves to the current URL, query string included.
   * Clearing the last filter navigated back to the filtered page, so the
   * customer could never get out of a category once they were in one.
   */
  it("returns the bare shop path when the last filter is cleared", () => {
    expect(
      shopHref(
        { category: "seasonings", sort: "featured" },
        { category: undefined },
      ),
    ).toBe("/shop");
  });

  it("never returns a bare query string for any single filter", () => {
    const cleared = [
      shopHref({ heat: "mild", sort: "featured" }, { heat: undefined }),
      shopHref({ price: "5-10", sort: "featured" }, { price: undefined }),
      shopHref({ dietary: "vegan", sort: "featured" }, { dietary: undefined }),
    ];

    for (const href of cleared) {
      expect(href).toBe("/shop");
      expect(href.startsWith("?")).toBe(false);
    }
  });
});

describe("price bands", () => {
  const base = { sort: "featured" as const };
  const range = [
    product("cheap", { prices: [275, 1150] }),
    product("mid", { prices: [650] }),
    product("dear", { prices: [1250] }),
  ];

  it("matches on any size, so a multi-size product appears in every band it spans", () => {
    // "cheap" runs £2.75 to £11.50, so it belongs in the top band as well.
    expect(
      applyFilters(range, { ...base, price: "under-5" }).map((p) => p.slug),
    ).toEqual(["cheap"]);
    expect(
      applyFilters(range, { ...base, price: "over-10" }).map((p) => p.slug),
    ).toEqual(["cheap", "dear"]);
  });

  it("treats the upper bound as exclusive so bands never overlap", () => {
    const onBoundary = [product("exactly-five", { prices: [500] })];
    expect(
      applyFilters(onBoundary, { ...base, price: "under-5" }),
    ).toHaveLength(0);
    expect(applyFilters(onBoundary, { ...base, price: "5-10" })).toHaveLength(
      1,
    );
  });

  it("excludes a product with no size in the band", () => {
    // "mid" is a single £6.50 size, so it is absent from both outer bands.
    expect(
      applyFilters(range, { ...base, price: "under-5" }),
    ).not.toContainEqual(expect.objectContaining({ slug: "mid" }));
    expect(
      applyFilters(range, { ...base, price: "5-10" }).map((p) => p.slug),
    ).toContain("mid");
  });

  it("ignores a price band that is not real", () => {
    expect(parseFilters({ price: "free" }).price).toBeUndefined();
  });

  it("keeps the band in the query string", () => {
    expect(shopHref({ sort: "featured" }, { price: "5-10" })).toBe(
      "/shop?price=5-10",
    );
  });
});

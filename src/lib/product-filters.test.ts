import { describe, expect, it } from "vitest";

import { applyFilters, buildQuery, parseFilters } from "@/lib/product-filters";
import type { Product } from "@/types/product";

function product(
  slug: string,
  overrides: Partial<Product> & { prices: number[] },
): Product {
  const { prices, ...rest } = overrides;
  return {
    id: slug,
    slug,
    name: slug,
    summary: "",
    description: "",
    variants: prices.map((price, index) => ({
      size: `${index}g`,
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

describe("buildQuery", () => {
  it("omits the default sort so clean URLs stay clean", () => {
    expect(buildQuery({ sort: "featured" }, {})).toBe("");
  });

  it("keeps other filters when one changes", () => {
    expect(
      buildQuery({ category: "seasonings", sort: "featured" }, { heat: "hot" }),
    ).toBe("?category=seasonings&heat=hot");
  });

  it("clears a filter when overridden with undefined", () => {
    expect(
      buildQuery(
        { category: "seasonings", sort: "featured" },
        { category: undefined },
      ),
    ).toBe("");
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
    expect(buildQuery({ sort: "featured" }, { price: "5-10" })).toBe(
      "?price=5-10",
    );
  });
});

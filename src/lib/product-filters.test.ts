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
  product("beans-mild", { prices: [275, 1150], heat: "mild" }),
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
    const filters = parseFilters({ heat: "nuclear", sort: "cheapest" });
    expect(filters.heat).toBeUndefined();
    expect(filters.sort).toBe("featured");
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

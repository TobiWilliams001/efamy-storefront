import { beforeEach, describe, expect, it, vi } from "vitest";

const fetch = vi.hoisted(() => vi.fn());
const getSanityClient = vi.hoisted(() => vi.fn());

vi.mock("@/sanity/client", () => ({ getSanityClient }));

import {
  getCategories,
  getProductBySlug,
  getProducts,
  getRecipe,
  getRecipes,
} from "@/lib/catalogue";
import { products as staticProducts } from "@/lib/catalogue-data";
import { recipes as staticRecipes } from "@/lib/recipes";

beforeEach(() => {
  fetch.mockReset();
  getSanityClient.mockReset();
  getSanityClient.mockReturnValue({ fetch });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

/**
 * The fallback is a resilience guarantee, not a convenience: a CMS outage, an
 * unconfigured project, or a query that starts returning rubbish must all
 * degrade to the bundled catalogue rather than an empty shop.
 */
describe("catalogue falls back to static data", () => {
  it("uses static products when Sanity is not configured at all", async () => {
    getSanityClient.mockReturnValue(null);

    expect(await getProducts()).toHaveLength(staticProducts.length);
  });

  it("uses static products when Sanity throws", async () => {
    fetch.mockRejectedValue(new Error("network down"));

    expect(await getProducts()).toHaveLength(staticProducts.length);
  });

  it("uses static products when Sanity returns an empty array", async () => {
    // The dangerous case: a dataset with no products would otherwise render a
    // shop with nothing in it.
    fetch.mockResolvedValue([]);

    expect(await getProducts()).toHaveLength(staticProducts.length);
  });

  it("uses static products when every Sanity document is unmappable", async () => {
    fetch.mockResolvedValue([{ nonsense: true }, { alsoNonsense: true }]);

    expect(await getProducts()).toHaveLength(staticProducts.length);
  });

  it("falls back per category too", async () => {
    fetch.mockResolvedValue([]);

    expect((await getCategories()).length).toBeGreaterThan(0);
  });

  it("falls back to the static recipe set", async () => {
    fetch.mockResolvedValue([]);

    expect(await getRecipes()).toHaveLength(staticRecipes.length);
  });

  it("falls back for a single product by slug", async () => {
    fetch.mockResolvedValue(null);
    const slug = staticProducts[0].slug;

    expect((await getProductBySlug(slug))?.slug).toBe(slug);
  });

  it("falls back for a single recipe by slug", async () => {
    fetch.mockResolvedValue(null);
    const slug = staticRecipes[0].slug;

    expect((await getRecipe(slug))?.slug).toBe(slug);
  });

  it("returns undefined for a slug that exists nowhere", async () => {
    fetch.mockResolvedValue(null);

    expect(await getProductBySlug("no-such-product")).toBeUndefined();
  });
});

describe("catalogue prefers Sanity when it answers", () => {
  it("returns Sanity products over the static set", async () => {
    fetch.mockResolvedValue([
      {
        id: "sanity-1",
        slug: "sanity-sauce",
        name: "Sanity Sauce",
        summary: "From the CMS",
        description: "From the CMS",
        variants: [{ size: "175g", price: 300, inStock: true }],
        category: { slug: "chilli-sauces", name: "Chilli Sauces" },
        image: { url: "/x.png", alt: "", width: 1, height: 1 },
      },
    ]);

    const products = await getProducts();

    expect(products).toHaveLength(1);
    expect(products[0].slug).toBe("sanity-sauce");
  });

  it("drops only the unmappable documents, keeping the good ones", async () => {
    fetch.mockResolvedValue([
      { broken: true },
      {
        id: "sanity-2",
        slug: "good-one",
        name: "Good One",
        summary: "s",
        description: "d",
        variants: [{ size: "175g", price: 300, inStock: true }],
        category: { slug: "chilli-sauces", name: "Chilli Sauces" },
        image: { url: "/x.png", alt: "", width: 1, height: 1 },
      },
    ]);

    const products = await getProducts();

    expect(products).toHaveLength(1);
    expect(products[0].slug).toBe("good-one");
  });
});

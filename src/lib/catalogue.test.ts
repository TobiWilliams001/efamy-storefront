import { beforeEach, describe, expect, it, vi } from "vitest";

const fetch = vi.hoisted(() => vi.fn());
const getSanityClient = vi.hoisted(() => vi.fn());

vi.mock("@/sanity/client", () => ({ getSanityClient }));

import {
  getCategories,
  getFeaturedProducts,
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

function sanityProduct(slug: string, name: string) {
  return {
    id: `sanity-${slug}`,
    slug,
    name,
    summary: "From the CMS",
    description: "From the CMS",
    variants: [{ size: "175g", price: 300, inStock: true }],
    category: { slug: "chilli-sauces", name: "Chilli Sauces" },
    image: { url: "/x.png", alt: "", width: 1, height: 1 },
  };
}

/**
 * Sanity augments the bundled catalogue. The dataset is filled one document at
 * a time, and replacing would mean the first product created in the Studio
 * takes the shop from seventeen products to one.
 */
describe("catalogue merges Sanity over the bundled set", () => {
  it("keeps the bundled products when Sanity adds a new one", async () => {
    fetch.mockResolvedValue([sanityProduct("sanity-sauce", "Sanity Sauce")]);

    const products = await getProducts();

    expect(products).toHaveLength(staticProducts.length + 1);
    expect(products.at(-1)?.slug).toBe("sanity-sauce");
  });

  it("lets a Sanity document override the bundled product of the same slug", async () => {
    const slug = staticProducts[0].slug;
    fetch.mockResolvedValue([sanityProduct(slug, "Renamed In Studio")]);

    const products = await getProducts();

    expect(products).toHaveLength(staticProducts.length);
    expect(products[0].slug).toBe(slug);
    expect(products[0].name).toBe("Renamed In Studio");
  });

  it("preserves the bundled order rather than shuffling as documents appear", async () => {
    fetch.mockResolvedValue([sanityProduct(staticProducts[3].slug, "Edited")]);

    const products = await getProducts();

    expect(products.map((product) => product.slug)).toEqual(
      staticProducts.map((product) => product.slug),
    );
  });

  it("drops only the unmappable documents, keeping the good ones", async () => {
    fetch.mockResolvedValue([
      { broken: true },
      sanityProduct("good-one", "Good One"),
    ]);

    const products = await getProducts();

    expect(products).toHaveLength(staticProducts.length + 1);
    expect(products.some((product) => product.slug === "good-one")).toBe(true);
  });

  it("tops a short featured row up from the bundled curation", async () => {
    // Sanity flags one product as featured; the row still needs four.
    fetch.mockImplementation((query: string) =>
      query.includes("featured")
        ? [sanityProduct("cms-featured", "CMS Featured")]
        : [],
    );

    const featured = await getFeaturedProducts(4);

    expect(featured).toHaveLength(4);
    expect(featured[0].slug).toBe("cms-featured");
    expect(new Set(featured.map((product) => product.slug)).size).toBe(4);
  });
});

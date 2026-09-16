import { beforeEach, describe, expect, it, vi } from "vitest";

import { priceBasket } from "@/lib/pricing";
import type { Product } from "@/types/product";

const getProductBySlug = vi.hoisted(() => vi.fn());

vi.mock("@/lib/catalogue", () => ({ getProductBySlug }));

function product(slug: string, overrides: Partial<Product> = {}): Product {
  return {
    id: slug,
    slug,
    name: slug,
    summary: "",
    description: "",
    variants: [
      { size: "175g", price: 325, inStock: true },
      { size: "250g", price: 475, inStock: true },
    ],
    category: { slug: "chilli-sauces", name: "Chilli Sauces" },
    ...overrides,
  } as Product;
}

beforeEach(() => {
  getProductBySlug.mockReset();
  getProductBySlug.mockImplementation(async (slug: string) =>
    slug === "beef" ? product("beef") : undefined,
  );
});

describe("priceBasket", () => {
  it("prices from the catalogue, not from what was sent", async () => {
    const result = await priceBasket([
      { slug: "beef", size: "250g", quantity: 2 },
    ]);

    expect(result).toMatchObject({
      ok: true,
      subtotal: 950,
      lines: [{ unitPrice: 475, lineTotal: 950 }],
    });
  });

  it("refuses an empty basket", async () => {
    expect(await priceBasket([])).toMatchObject({
      ok: false,
      failure: { reason: "empty" },
    });
  });

  it("refuses a product that does not exist", async () => {
    expect(
      await priceBasket([{ slug: "nope", size: "250g", quantity: 1 }]),
    ).toMatchObject({ ok: false, failure: { reason: "unknown-product" } });
  });

  it("refuses a size the product does not come in", async () => {
    expect(
      await priceBasket([{ slug: "beef", size: "999g", quantity: 1 }]),
    ).toMatchObject({ ok: false, failure: { reason: "unknown-size" } });
  });

  it("refuses a variant that is out of stock", async () => {
    getProductBySlug.mockResolvedValue(
      product("beef", {
        variants: [{ size: "175g", price: 325, inStock: false }],
      }),
    );

    expect(
      await priceBasket([{ slug: "beef", size: "175g", quantity: 1 }]),
    ).toMatchObject({ ok: false, failure: { reason: "out-of-stock" } });
  });

  it.each([0, -1, 1.5, 100, Number.NaN])(
    "refuses a quantity of %s",
    async (quantity) => {
      expect(
        await priceBasket([{ slug: "beef", size: "175g", quantity }]),
      ).toMatchObject({ ok: false, failure: { reason: "bad-quantity" } });
    },
  );

  it("refuses the whole basket when one line is bad, charging nothing", async () => {
    const result = await priceBasket([
      { slug: "beef", size: "175g", quantity: 1 },
      { slug: "nope", size: "175g", quantity: 1 },
    ]);

    expect(result.ok).toBe(false);
  });
});

describe("strength is part of the identity", () => {
  const twoStrengths = product("beef", {
    variants: [
      { size: "175g", heat: "mild", price: 325, inStock: true },
      { size: "175g", heat: "hot", price: 325, inStock: true },
    ],
  });

  it("prices the strength that was asked for", async () => {
    getProductBySlug.mockResolvedValue(twoStrengths);

    const result = await priceBasket([
      { slug: "beef", size: "175g", heat: "hot", quantity: 1 },
    ]);

    expect(result).toMatchObject({ ok: true });
    if (result.ok) expect(result.lines[0].heat).toBe("hot");
  });

  it("names the jar so the Stripe line says which one it is", async () => {
    getProductBySlug.mockResolvedValue(twoStrengths);

    const result = await priceBasket([
      { slug: "beef", size: "175g", heat: "mild", quantity: 1 },
    ]);

    if (result.ok) expect(result.lines[0].name).toBe("beef, mild, 175g");
  });

  /*
   * The client caught this on the live shop: the Stripe page showed the Mild
   * jar to someone buying Extra hot, because the line carried the product's
   * default photograph rather than the one belonging to the strength.
   */
  it("carries the strength's own photograph, not the product's default", async () => {
    getProductBySlug.mockResolvedValue(
      product("beef", {
        image: { url: "/mild.png", alt: "mild", width: 1, height: 1 },
        variants: [
          {
            size: "175g",
            price: 325,
            inStock: true,
            heat: "extra-hot",
            image: { url: "/extra-hot.png", alt: "extra hot", width: 1, height: 1 },
          },
        ],
      }),
    );

    const result = await priceBasket([
      { slug: "beef", size: "175g", heat: "extra-hot", quantity: 1 },
    ]);

    if (result.ok) expect(result.lines[0].imageUrl).toBe("/extra-hot.png");
  });

  it("falls back to the product photograph when a strength has none", async () => {
    getProductBySlug.mockResolvedValue(
      product("beef", {
        image: { url: "/default.png", alt: "default", width: 1, height: 1 },
        variants: [{ size: "175g", price: 325, inStock: true }],
      }),
    );

    const result = await priceBasket([
      { slug: "beef", size: "175g", quantity: 1 },
    ]);

    if (result.ok) expect(result.lines[0].imageUrl).toBe("/default.png");
  });

  it("refuses a strength the jar is not sold in", async () => {
    getProductBySlug.mockResolvedValue(twoStrengths);

    expect(
      await priceBasket([
        { slug: "beef", size: "175g", heat: "extra-hot", quantity: 1 },
      ]),
    ).toMatchObject({ ok: false, failure: { reason: "unknown-size" } });
  });

  it("still matches a product sold in one strength when none is sent", async () => {
    getProductBySlug.mockResolvedValue(
      product("mix", {
        variants: [{ size: "300g", price: 475, inStock: true }],
      }),
    );

    expect(
      await priceBasket([{ slug: "mix", size: "300g", quantity: 1 }]),
    ).toMatchObject({ ok: true });
  });
});

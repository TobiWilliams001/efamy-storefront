import { beforeEach, describe, expect, it, vi } from "vitest";

import { basketFingerprint, priceBasket } from "@/lib/pricing";
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

describe("basketFingerprint", () => {
  it("is stable regardless of line order", () => {
    const a = basketFingerprint([
      { slug: "beef", size: "175g", quantity: 1 },
      { slug: "pork", size: "250g", quantity: 2 },
    ]);
    const b = basketFingerprint([
      { slug: "pork", size: "250g", quantity: 2 },
      { slug: "beef", size: "175g", quantity: 1 },
    ]);

    expect(a).toBe(b);
  });

  it("changes when a quantity changes", () => {
    expect(
      basketFingerprint([{ slug: "beef", size: "175g", quantity: 1 }]),
    ).not.toBe(
      basketFingerprint([{ slug: "beef", size: "175g", quantity: 2 }]),
    );
  });
});

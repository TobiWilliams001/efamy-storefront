import { describe, expect, it } from "vitest";

import {
  lineId,
  reducer,
  type AddableProduct,
  type CartState,
} from "@/components/cart/cart-provider";
import type { ProductVariant } from "@/types/product";

const beef: AddableProduct = {
  id: "beef",
  slug: "beef-chilli-sauce-hot",
  name: "Beef Chilli Sauce — Hot",
  image: { url: "/beef.jpg", alt: "Beef", width: 100, height: 100 },
};

const chicken: AddableProduct = {
  id: "chicken",
  slug: "chicken-chilli-sauce-hot",
  name: "Chicken Chilli Sauce — Hot",
  image: { url: "/chicken.jpg", alt: "Chicken", width: 100, height: 100 },
};

const small: ProductVariant = { size: "175g", price: 325, inStock: true };
const large: ProductVariant = { size: "800g", price: 1250, inStock: true };

const empty: CartState = { lines: [], ready: true };

const add = (
  state: CartState,
  product: AddableProduct,
  variant: ProductVariant,
  quantity = 1,
) => reducer(state, { type: "add", product, variant, quantity });

const subtotal = (state: CartState) =>
  state.lines.reduce((total, line) => total + line.price * line.quantity, 0);

describe("cart reducer", () => {
  it("adds a line carrying the chosen variant's size and price", () => {
    const state = add(empty, beef, small);
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0]).toMatchObject({
      productId: "beef",
      size: "175g",
      price: 325,
      quantity: 1,
    });
  });

  it("merges quantity when the same product and size is added again", () => {
    const state = add(add(empty, beef, small), beef, small, 2);
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0].quantity).toBe(3);
  });

  it("keeps two sizes of one product as separate lines", () => {
    const state = add(add(empty, beef, small), beef, large);
    expect(state.lines).toHaveLength(2);
    expect(state.lines.map((line) => line.size)).toEqual(["175g", "800g"]);
    // 325 + 1250. Getting this wrong undercharges by the difference.
    expect(subtotal(state)).toBe(1575);
  });

  it("keeps different products apart", () => {
    const state = add(add(empty, beef, small), chicken, small);
    expect(state.lines).toHaveLength(2);
  });

  it("changes quantity on the addressed line only", () => {
    let state = add(add(empty, beef, small), beef, large);
    state = reducer(state, {
      type: "setQuantity",
      id: lineId("beef", "175g"),
      quantity: 4,
    });
    expect(state.lines[0].quantity).toBe(4);
    expect(state.lines[1].quantity).toBe(1);
    expect(subtotal(state)).toBe(325 * 4 + 1250);
  });

  it("removes by line id, not product id", () => {
    let state = add(add(empty, beef, small), beef, large);
    state = reducer(state, { type: "remove", id: lineId("beef", "175g") });
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0].size).toBe("800g");
  });

  it("clamps quantity between 1 and 99", () => {
    let state = add(empty, beef, small, 500);
    expect(state.lines[0].quantity).toBe(99);

    state = reducer(state, {
      type: "setQuantity",
      id: lineId("beef", "175g"),
      quantity: 0,
    });
    expect(state.lines[0].quantity).toBe(1);

    state = reducer(state, {
      type: "setQuantity",
      id: lineId("beef", "175g"),
      quantity: -10,
    });
    expect(state.lines[0].quantity).toBe(1);
  });

  it("rounds fractional quantities rather than storing them", () => {
    const state = add(empty, beef, small, 2.6);
    expect(state.lines[0].quantity).toBe(3);
  });

  it("hydrate replaces the basket and marks it ready", () => {
    const state = reducer(
      { lines: [], ready: false },
      {
        type: "hydrate",
        lines: [
          {
            id: "beef:175g",
            productId: "beef",
            slug: "beef",
            name: "Beef",
            size: "175g",
            price: 325,
            imageUrl: "/beef.jpg",
            imageAlt: "Beef",
            quantity: 2,
          },
        ],
      },
    );
    expect(state.ready).toBe(true);
    expect(state.lines).toHaveLength(1);
  });

  it("clear empties the basket without losing ready", () => {
    const state = reducer(add(empty, beef, small), { type: "clear" });
    expect(state.lines).toHaveLength(0);
    expect(state.ready).toBe(true);
  });

  it("never mutates the previous state", () => {
    const before = add(empty, beef, small);
    const snapshot = JSON.stringify(before);
    add(before, chicken, large);
    reducer(before, { type: "remove", id: lineId("beef", "175g") });
    expect(JSON.stringify(before)).toBe(snapshot);
  });
});

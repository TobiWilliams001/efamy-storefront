import { describe, expect, it } from "vitest";

import {
  assertDeliveryIsReal,
  delivery,
  deliveryCost,
} from "@/config/delivery";

const RATE = delivery.standardRate;
const FREE_AT = delivery.freeOverSubtotal;

describe("deliveryCost", () => {
  it("charges the standard rate on a small basket", () => {
    expect(deliveryCost(100)).toBe(RATE);
  });

  it("charges the standard rate one penny below the threshold", () => {
    expect(deliveryCost(FREE_AT - 1)).toBe(RATE);
  });

  it("is free exactly at the threshold, not a penny above it", () => {
    // The off-by-one that would charge someone who has met the offer.
    expect(deliveryCost(FREE_AT)).toBe(0);
  });

  it("is free above the threshold", () => {
    expect(deliveryCost(FREE_AT + 5000)).toBe(0);
  });

  it("charges the standard rate on an empty basket rather than nothing", () => {
    // A zero subtotal must never accidentally qualify as free delivery.
    expect(deliveryCost(0)).toBe(RATE);
  });
});

describe("assertDeliveryIsReal", () => {
  it("allows placeholder rates in test mode, which is what test mode is for", () => {
    expect(() => assertDeliveryIsReal("sk_test_abc123")).not.toThrow();
  });

  it("refuses to charge a live card at rates nobody has confirmed", () => {
    expect(() => assertDeliveryIsReal("sk_live_abc123")).toThrow(
      /provisional placeholders/i,
    );
  });

  it("names the file to edit, so the error is actionable", () => {
    expect(() => assertDeliveryIsReal("sk_live_abc123")).toThrow(
      /src\/config\/delivery\.ts/,
    );
  });
});

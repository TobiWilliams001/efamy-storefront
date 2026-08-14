import { describe, expect, it } from "vitest";

import {
  assertDeliveryIsReal,
  delivery,
  deliveryCost,
} from "@/config/delivery";

const RATE = delivery.standardRate;

describe("deliveryCost", () => {
  it("charges the standard rate on a small basket", () => {
    expect(deliveryCost(100)).toBe(RATE);
  });

  it("charges the standard rate on a large basket", () => {
    // No free-delivery threshold has been agreed, so size changes nothing.
    expect(deliveryCost(50_000)).toBe(RATE);
  });

  it("charges the standard rate on an empty basket rather than nothing", () => {
    expect(deliveryCost(0)).toBe(RATE);
  });

  it("goes free at the threshold once one is set", () => {
    // Guards the branch so turning the offer on later cannot silently misfire.
    expect(deliveryCost(4000, 4000)).toBe(0);
    expect(deliveryCost(3999, 4000)).toBe(RATE);
  });
});

describe("assertDeliveryIsReal", () => {
  it("lets live payments through now that the rate is Efamy's own", () => {
    expect(() => assertDeliveryIsReal(true)).not.toThrow();
  });

  it("allows placeholder rates in test mode, which is what test mode is for", () => {
    expect(() => assertDeliveryIsReal(false, true)).not.toThrow();
  });

  it("refuses to charge a live card at rates nobody has confirmed", () => {
    expect(() => assertDeliveryIsReal(true, true)).toThrow(
      /provisional placeholders/i,
    );
  });

  it("names the file to edit, so the error is actionable", () => {
    expect(() => assertDeliveryIsReal(true, true)).toThrow(
      /src\/config\/delivery\.ts/,
    );
  });
});

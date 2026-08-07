import { describe, expect, it } from "vitest";

import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("renders pence as pounds", () => {
    expect(formatPrice(325)).toBe("£3.25");
    expect(formatPrice(1250)).toBe("£12.50");
  });

  it("keeps trailing zeros, so prices do not read as £4.7", () => {
    expect(formatPrice(475)).toBe("£4.75");
    expect(formatPrice(400)).toBe("£4.00");
    expect(formatPrice(1000)).toBe("£10.00");
  });

  it("handles round pounds and zero", () => {
    expect(formatPrice(0)).toBe("£0.00");
    expect(formatPrice(100)).toBe("£1.00");
  });

  it("groups thousands, for trade-sized totals", () => {
    expect(formatPrice(295_00)).toBe("£295.00");
    expect(formatPrice(1_234_56)).toBe("£1,234.56");
  });

  it("does not drift when summing a basket", () => {
    // The reason money is held in pence: doing this with 0.1 + 0.2 style
    // floats accumulates error across a basket.
    const lines = [325, 475, 875, 1250, 299];
    const total = lines.reduce((sum, price) => sum + price, 0);
    expect(total).toBe(3224);
    expect(formatPrice(total)).toBe("£32.24");
  });
});

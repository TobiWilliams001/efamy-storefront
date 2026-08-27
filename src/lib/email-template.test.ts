import { describe, expect, it } from "vitest";

import { escapeHtml, itemRows, layout } from "@/lib/email-template";

describe("email templates", () => {
  /*
   * Item descriptions and customer names arrive from Stripe, which got them
   * from a person. Anything unescaped there lands inside our markup.
   */
  it("escapes anything that came from outside", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
    expect(escapeHtml("Beef & Chilli")).toBe("Beef &amp; Chilli");
  });

  it("escapes a hostile item description rather than rendering it", () => {
    const html = itemRows([
      {
        quantity: 1,
        description: '<img src=x onerror="steal()">',
        amount: "£4.75",
      },
    ]);

    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("always carries a preheader so the inbox preview is not the logo", () => {
    const html = layout({
      heading: "Your Efamy order",
      preheader: "Order confirmed, £22.48",
      content: "<p>hello</p>",
    });

    expect(html).toContain("Order confirmed, £22.48");
    expect(html.indexOf("Order confirmed")).toBeLessThan(html.indexOf("efamy"));
  });

  it("renders nothing for an order with no line items", () => {
    expect(itemRows([])).toBe("");
  });
});

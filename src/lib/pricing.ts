import { getProductBySlug } from "@/lib/catalogue";

/**
 * What the browser is allowed to tell us: what they want and how many. Never
 * what it costs. Everything else is looked up server-side.
 */
export type RequestedLine = {
  slug: string;
  size: string;
  quantity: number;
};

export type PricedLine = {
  slug: string;
  size: string;
  quantity: number;
  name: string;
  /** Pence, from the catalogue as it stands right now. */
  unitPrice: number;
  lineTotal: number;
  imageUrl?: string;
};

export type PricingFailure =
  | { reason: "unknown-product"; slug: string }
  | { reason: "unknown-size"; slug: string; size: string }
  | { reason: "out-of-stock"; slug: string; size: string }
  | { reason: "bad-quantity"; slug: string; size: string }
  | { reason: "empty" };

export type PricingResult =
  | { ok: true; lines: PricedLine[]; subtotal: number }
  | { ok: false; failure: PricingFailure };

export const MAX_LINE_QUANTITY = 99;

/**
 * Rebuilds a basket from the catalogue, ignoring every price the browser sent.
 *
 * The cart in `localStorage` is a display convenience and an untrusted input —
 * it can be edited freely in devtools, and it can be stale for weeks after a
 * price change. A basket that fails here is never partially charged: the whole
 * checkout is refused so the customer sees an accurate basket before paying.
 */
export async function priceBasket(
  requested: RequestedLine[],
): Promise<PricingResult> {
  if (requested.length === 0) {
    return { ok: false, failure: { reason: "empty" } };
  }

  const lines: PricedLine[] = [];

  for (const line of requested) {
    if (
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > MAX_LINE_QUANTITY
    ) {
      return {
        ok: false,
        failure: {
          reason: "bad-quantity",
          slug: line.slug,
          size: line.size,
        },
      };
    }

    const product = await getProductBySlug(line.slug);

    if (!product) {
      return {
        ok: false,
        failure: { reason: "unknown-product", slug: line.slug },
      };
    }

    const variant = product.variants.find((v) => v.size === line.size);

    if (!variant) {
      return {
        ok: false,
        failure: { reason: "unknown-size", slug: line.slug, size: line.size },
      };
    }

    if (!variant.inStock) {
      return {
        ok: false,
        failure: { reason: "out-of-stock", slug: line.slug, size: line.size },
      };
    }

    lines.push({
      slug: product.slug,
      size: variant.size,
      quantity: line.quantity,
      name: `${product.name} — ${variant.size}`,
      unitPrice: variant.price,
      lineTotal: variant.price * line.quantity,
      imageUrl: product.image?.url,
    });
  }

  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);

  return { ok: true, lines, subtotal };
}

import { getProductBySlug } from "@/lib/catalogue";
import { variantAvailable } from "@/types/product";

/**
 * What the browser is allowed to tell us: what they want and how many. Never
 * what it costs. Everything else is looked up server-side.
 */
export type RequestedLine = {
  slug: string;
  size: string;
  heat?: string;
  quantity: number;
};

export type PricedLine = {
  slug: string;
  size: string;
  heat?: string;
  quantity: number;
  name: string;
  /** Pence, from the catalogue as it stands right now. */
  unitPrice: number;
  lineTotal: number;
  imageUrl?: string;
};

export type PricingFailure =
  | { reason: "unknown-product"; slug: string; name: string }
  | { reason: "unknown-size"; slug: string; size: string; name: string }
  | { reason: "out-of-stock"; slug: string; size: string; name: string }
  | {
      reason: "not-enough-stock";
      slug: string;
      size: string;
      name: string;
      available: number;
    }
  | { reason: "bad-quantity"; slug: string; size: string; name: string }
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
/** A slug is not a product name, but it is better than "one of the items". */
function readable(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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
          name: readable(line.slug),
        },
      };
    }

    const product = await getProductBySlug(line.slug);

    if (!product) {
      return {
        ok: false,
        failure: {
          reason: "unknown-product",
          slug: line.slug,
          name: readable(line.slug),
        },
      };
    }

    // Size and strength together identify the jar.
    const variant = product.variants.find(
      (v) =>
        v.size === line.size &&
        (v.heat ?? undefined) === (line.heat ?? undefined),
    );

    if (!variant) {
      return {
        ok: false,
        failure: {
          reason: "unknown-size",
          slug: line.slug,
          size: line.size,
          name: product.name,
        },
      };
    }

    if (!variantAvailable(variant)) {
      return {
        ok: false,
        failure: {
          reason: "out-of-stock",
          slug: line.slug,
          size: line.size,
          name: product.name,
        },
      };
    }

    /*
     * Checked against the count as it stands now, not as it stood when the
     * basket was filled. It does not make overselling impossible, because
     * nothing is reserved while someone is on Stripe's payment page, but it
     * stops the obvious case of ordering six when two are left.
     */
    if (variant.stock !== undefined && line.quantity > variant.stock) {
      return {
        ok: false,
        failure: {
          reason: "not-enough-stock",
          slug: line.slug,
          size: line.size,
          name: product.name,
          available: variant.stock,
        },
      };
    }

    lines.push({
      slug: product.slug,
      size: variant.size,
      heat: variant.heat,
      quantity: line.quantity,
      name: [product.name, variant.heat, variant.size]
        .filter(Boolean)
        .join(", "),
      unitPrice: variant.price,
      lineTotal: variant.price * line.quantity,
      imageUrl: product.image?.url,
    });
  }

  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);

  return { ok: true, lines, subtotal };
}

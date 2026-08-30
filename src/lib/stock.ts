import "server-only";

import type Stripe from "stripe";

import { sendEmail, orderInbox } from "@/lib/email";
import { getSanityWriteClient } from "@/sanity/client";
import { siteConfig } from "@/config/site";

export type SoldLine = { slug: string; size: string; quantity: number };

/**
 * Reads back what was bought from the session metadata written at checkout.
 *
 * Stripe line items carry only a description, so the basket is recorded
 * separately as `slug|size|qty;…` when the session is created. Anything that
 * does not parse is skipped: a stock count is worth less than an order.
 */
export function soldLines(session: Stripe.Checkout.Session): SoldLine[] {
  const raw = session.metadata?.efamy_lines;
  if (!raw) return [];

  return raw
    .split(";")
    .map((entry) => entry.split("|"))
    .filter((parts) => parts.length === 3)
    .map(([slug, size, quantity]) => ({
      slug,
      size,
      quantity: Number(quantity),
    }))
    .filter(
      (line) => line.slug && line.size && Number.isInteger(line.quantity),
    );
}

type Emptied = { name: string; size: string };

/**
 * Counts stock down, and reports which sizes hit zero.
 *
 * Decrements through Sanity's `dec`, which is applied server-side, so two
 * orders landing together cannot read the same number and write it back twice.
 * It can still go below zero: nothing is reserved while a customer is on
 * Stripe's payment page, so the honest response to overselling is to tell Efamy
 * rather than pretend it cannot happen.
 */
export async function decrementStock(
  session: Stripe.Checkout.Session,
): Promise<Emptied[]> {
  const client = getSanityWriteClient();
  const lines = soldLines(session);
  if (!client || lines.length === 0) return [];

  const emptied: Emptied[] = [];

  for (const line of lines) {
    const product = await client.fetch<{
      _id: string;
      name: string;
      variants?: { _key: string; size: string; stock?: number }[];
    } | null>(
      `*[_type == "product" && slug.current == $slug][0]{_id, name, variants[]{_key, size, stock}}`,
      { slug: line.slug },
    );

    const variant = product?.variants?.find(
      (entry) => entry.size === line.size,
    );
    if (!product || !variant || typeof variant.stock !== "number") continue;

    const left = variant.stock - line.quantity;

    await client
      .patch(product._id)
      .dec({ [`variants[_key=="${variant._key}"].stock`]: line.quantity })
      .commit();

    if (left <= 0) emptied.push({ name: product.name, size: line.size });
  }

  return emptied;
}

/** Tells Efamy what has just run out, so they can make more or take it off. */
export async function reportSoldOut(emptied: Emptied[]): Promise<void> {
  if (emptied.length === 0) return;

  const list = emptied.map((item) => `  ${item.name}, ${item.size}`).join("\n");

  await sendEmail({
    to: orderInbox(),
    subject:
      emptied.length === 1
        ? `Sold out: ${emptied[0].name}, ${emptied[0].size}`
        : `Sold out: ${emptied.length} sizes`,
    text: [
      "That last order took these down to zero, so they have come off the shop:",
      "",
      list,
      "",
      "They will come back on their own once you set a new number in the Studio,",
      "under Stock. Nothing else needs doing.",
      "",
      siteConfig.legalName,
    ].join("\n"),
  });
}

"use server";

import { z } from "zod";

import { siteConfig } from "@/config/site";
import {
  assertDeliveryIsReal,
  delivery,
  deliveryCost,
} from "@/config/delivery";
import {
  basketFingerprint,
  MAX_LINE_QUANTITY,
  priceBasket,
} from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";

const schema = z.object({
  lines: z
    .array(
      z.object({
        slug: z.string().min(1).max(200),
        size: z.string().min(1).max(50),
        quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
      }),
    )
    .min(1)
    .max(50),
});

export type CheckoutResult =
  { status: "redirect"; url: string } | { status: "error"; message: string };

const FAILURE_MESSAGES: Record<string, string> = {
  empty: "Your basket is empty.",
  "unknown-product": "One of the items is no longer available.",
  "unknown-size": "One of the sizes is no longer available.",
  "out-of-stock": "One of the items has gone out of stock.",
  "bad-quantity": "One of the quantities is not valid.",
};

export async function startCheckout(input: unknown): Promise<CheckoutResult> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return { status: "error", message: "That basket could not be read." };
  }

  // Prices come from the catalogue, never from the browser.
  const priced = await priceBasket(parsed.data.lines);

  if (!priced.ok) {
    return {
      status: "error",
      message:
        FAILURE_MESSAGES[priced.failure.reason] ??
        "Your basket needs checking before you can pay.",
    };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return {
      status: "error",
      message: `Card payment is not switched on yet. Email ${siteConfig.contact.email} and we will take your order.`,
    };
  }

  assertDeliveryIsReal(secretKey);

  const shipping = deliveryCost(priced.subtotal);
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        currency: "gbp",
        line_items: priced.lines.map((line) => ({
          quantity: line.quantity,
          price_data: {
            currency: "gbp",
            unit_amount: line.unitPrice,
            product_data: {
              name: line.name,
              images: line.imageUrl
                ? [new URL(line.imageUrl, siteConfig.url).toString()]
                : undefined,
            },
          },
        })),
        shipping_address_collection: {
          allowed_countries: [...delivery.countries],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              display_name: delivery.label,
              fixed_amount: { amount: shipping, currency: "gbp" },
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: delivery.estimatedDaysMin,
                },
                maximum: {
                  unit: "business_day",
                  value: delivery.estimatedDaysMax,
                },
              },
            },
          },
        ],
        phone_number_collection: { enabled: true },
        success_url: `${siteConfig.url}/order/confirmed?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteConfig.url}/cart`,
      },
      {
        /*
         * A double click or a refresh returns the same session rather than
         * opening a second one. Scoped to the basket contents, so changing the
         * basket correctly starts a new session.
         */
        idempotencyKey: `checkout:${basketFingerprint(parsed.data.lines)}`,
      },
    );

    if (!session.url) {
      return {
        status: "error",
        message: "Stripe did not return a payment page. Please try again.",
      };
    }

    return { status: "redirect", url: session.url };
  } catch (error) {
    // The customer gets a way forward; the detail goes to the server log.
    console.error("Stripe checkout session failed", error);

    return {
      status: "error",
      message: `We could not start payment just now. Please try again, or email ${siteConfig.contact.email}.`,
    };
  }
}

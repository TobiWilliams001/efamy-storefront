"use server";

import { z } from "zod";

import { siteConfig } from "@/config/site";
import {
  assertDeliveryIsReal,
  delivery,
  deliveryCost,
} from "@/config/delivery";
import { MAX_LINE_QUANTITY, priceBasket } from "@/lib/pricing";
import { getStripe, isLiveMode, paymentsEnabled } from "@/lib/stripe";

const schema = z.object({
  lines: z
    .array(
      z.object({
        slug: z.string().min(1).max(200),
        size: z.string().min(1).max(50),
        heat: z.string().max(20).optional(),
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
  "not-enough-stock":
    "There are fewer of one of those left than you asked for. Change the quantity in your basket and try again.",
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

  if (!paymentsEnabled()) {
    return {
      status: "error",
      message: `Card payment is not switched on yet. Email ${siteConfig.contact.email} and we will take your order.`,
    };
  }

  assertDeliveryIsReal(isLiveMode());

  const shipping = deliveryCost(priced.subtotal);
  const stripe = getStripe();

  /*
   * No idempotency key. The obvious one — a hash of the basket — is wrong twice
   * over: it is shared by every customer buying the same items, so Stripe would
   * replay the first customer's session to the second, handing them someone
   * else's email and address; and it pins the request to whatever parameters it
   * first saw, so any change to shipping or line items breaks checkout for 24
   * hours.
   *
   * Creating a second session costs nothing and only one of them can be paid,
   * so there is no double-charge to guard against. The button disables itself
   * while the request is in flight, which is what actually stops double clicks.
   */
  try {
    const session = await stripe.checkout.sessions.create({
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
            delivery_estimate:
              delivery.estimatedDaysMin && delivery.estimatedDaysMax
                ? {
                    minimum: {
                      unit: "business_day",
                      value: delivery.estimatedDaysMin,
                    },
                    maximum: {
                      unit: "business_day",
                      value: delivery.estimatedDaysMax,
                    },
                  }
                : undefined,
          },
        },
      ],
      phone_number_collection: { enabled: true },
      /*
       * What was bought, in a form the webhook can act on. Stripe line items
       * carry only a description, which is not enough to find the variant
       * again. Capped at Stripe's 500 characters: past that the stock count is
       * skipped rather than the order failing.
       */
      metadata: {
        efamy_lines: priced.lines
          .map((line) => `${line.slug}|${line.size}|${line.quantity}`)
          .join(";")
          .slice(0, 500),
      },
      success_url: `${siteConfig.url}/order/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteConfig.url}/cart`,
    });

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

/**
 * PROVISIONAL. These numbers were invented so checkout could be built and
 * tested. They are not Efamy's rates.
 *
 * `provisional` is asserted against the Stripe key in `assertDeliveryIsReal`,
 * so a live key plus made-up postage refuses to create a session rather than
 * overcharging a real customer. Replace the rates, set `provisional: false`,
 * and the guard lets go.
 */
export const delivery = {
  provisional: true,

  /** Pence. */
  standardRate: 495,
  /** Pence. Basket total at or above which delivery is free. null disables it. */
  freeOverSubtotal: 4000,

  label: "Standard UK delivery",
  /** Working days, shown to the customer before they pay. */
  estimatedDaysMin: 2,
  estimatedDaysMax: 4,

  /** ISO 3166-1 alpha-2. Stripe refuses addresses outside this list. */
  countries: ["GB"] as const,
} as const;

export function deliveryCost(subtotal: number): number {
  if (
    delivery.freeOverSubtotal !== null &&
    subtotal >= delivery.freeOverSubtotal
  ) {
    return 0;
  }

  return delivery.standardRate;
}

/**
 * Refuses to charge a real card at invented postage rates.
 *
 * Test mode is exactly where provisional numbers belong, so this only bites
 * once a live key is in play — which is the moment a wrong rate stops being a
 * placeholder and starts being money out of the business's pocket.
 */
export function assertDeliveryIsReal(stripeKey: string): void {
  if (delivery.provisional && stripeKey.startsWith("sk_live_")) {
    throw new Error(
      "Delivery rates in src/config/delivery.ts are still the provisional placeholders. " +
        "Set the real rates and flip `provisional` to false before taking live payments.",
    );
  }
}

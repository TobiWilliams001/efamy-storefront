"use client";

type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: GtagParams) => void;
  }
}

/**
 * Sends a GA4 event, or does nothing.
 *
 * `gtag` only exists once the visitor has accepted analytics cookies and an ID
 * is configured, so the consent check is implicit — there is no path where this
 * records anything a visitor has refused. It never throws: analytics must not
 * be able to break a checkout.
 */
export function track(event: string, params?: GtagParams) {
  try {
    window.gtag?.("event", event, params);
  } catch {
    // Deliberately swallowed. A tracking failure is not a customer's problem.
  }
}

/** GA4 expects major units, and the catalogue stores pence. */
export function toMajorUnits(pence: number): number {
  return Number((pence / 100).toFixed(2));
}

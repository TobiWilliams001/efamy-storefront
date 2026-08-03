import { siteConfig } from "@/config/site";

/**
 * Money is handled in minor units (pence) everywhere in this codebase — never
 * as floats. Only format at the point of display.
 */
export function formatPrice(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: siteConfig.currency,
  }).format(pence / 100);
}

/** Builds an absolute URL, required for metadata, sitemaps and structured data. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

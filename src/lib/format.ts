import { siteConfig } from "@/config/site";

export function formatPrice(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: siteConfig.currency,
  }).format(pence / 100);
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

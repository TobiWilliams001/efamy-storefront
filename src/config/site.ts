// Read as a literal rather than via lib/env so this stays importable from
// Client Components without dragging zod into the browser bundle.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "Efamy",
  legalName: "Efamy Food Products",
  tagline: "Authentic Ghanaian chilli sauces & seasonings",
  description:
    "Efamy Food Products makes authentic Ghanaian chilli sauces and seasoning mixes in the UK. Beans, beef, chicken, fish and pork sauces in mild and hot.",
  url: siteUrl,
  locale: "en_GB",
  currency: "GBP",
  contact: {
    email: "hello@efamy.co.uk",
    phone: "",
    /** International format without "+" or spaces, e.g. 447700900000. */
    whatsapp: "",
  },
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

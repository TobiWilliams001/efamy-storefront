import { env } from "@/lib/env";

/**
 * Single source of truth for brand-level information that appears across the
 * site (metadata, header, footer, structured data). Anything the client may
 * eventually want to edit without a deploy should move to the CMS instead.
 */
export const siteConfig = {
  name: "Efamy",
  legalName: "Efamy Food Products",
  tagline: "Authentic Ghanaian chilli sauces, oils & seasonings",
  description:
    "Efamy Food Products makes authentic Ghanaian chilli sauces, chilli oils and seasonings in the UK. Bold, small-batch flavour delivered to your door.",
  url: env.NEXT_PUBLIC_SITE_URL,
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

// Read as a literal rather than via lib/env so this stays importable from
// Client Components without dragging zod into the browser bundle.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type LogoAsset = { src: string; width: number; height: number };

export type SiteConfig = {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  currency: string;
  /**
   * Real logo files. Needs a transparent SVG or PNG in two versions: dark ink
   * for the light header, light ink for the maroon footer. The screenshot of
   * the jar label will not work, because the white wordmark has a dark
   * background baked into it.
   */
  logo: {
    dark: LogoAsset | null;
    light: LogoAsset | null;
  };
  contact: {
    email: string;
    phone: string;
    /** International format without "+" or spaces, e.g. 447700900000. */
    whatsapp: string;
  };
  social: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
};

// Typed rather than `as const`: the empty strings are placeholders awaiting the
// client's details, and a literal "" type narrows to `never` behind a truthy
// check, which breaks every conditional that renders them.
export const siteConfig: SiteConfig = {
  name: "Efamy",
  legalName: "Efamy Food Products",
  tagline: "Authentic Ghanaian flavours, crafted in the UK",
  description:
    "Efamy is a premium Ghanaian food brand, proudly made in the UK, bringing authentic flavours, trusted quality and traditional recipes to modern kitchens.",
  url: siteUrl,
  locale: "en_GB",
  currency: "GBP",
  /**
   * Real logo files. Needs a transparent SVG or PNG in two versions: dark ink
   * for the light header, light ink for the maroon footer. The screenshot of
   * the jar label will not work, because the white wordmark has a dark
   * background baked into it.
   */
  logo: {
    dark: null as { src: string; width: number; height: number } | null,
    light: null as { src: string; width: number; height: number } | null,
  },
  contact: {
    email: "hello@efamy.co.uk",
    phone: "",
    whatsapp: "",
  },
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

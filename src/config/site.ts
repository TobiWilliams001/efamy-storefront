// Read directly rather than through a validator, so this stays importable from
// Client Components without pulling zod into the browser bundle.
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
  /** Dark ink for the light header, light ink for the maroon footer. */
  logo: {
    dark: LogoAsset | null;
    light: LogoAsset | null;
  };
  contact: {
    email: string;
    phone: string;
    /** International format without "+" or spaces, e.g. 447700900000. */
    whatsapp: string;
    hours: string;
  };
  address: {
    line1: string;
    town: string;
    postcode: string;
    country: string;
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
  logo: {
    dark: { src: "/logos/efamy-logo-dark.png", width: 742, height: 336 },
    light: { src: "/logos/efamy-logo-light.png", width: 742, height: 336 },
  },
  contact: {
    email: "info@efamys.co.uk",
    phone: "+44 (0)7904 214 552",
    whatsapp: "447904214552",
    hours: "Monday to Friday, 9am to 5pm",
  },
  address: {
    line1: "17 Athelstan Road",
    town: "Kettering",
    postcode: "NN16 0NB",
    country: "United Kingdom",
  },
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/format";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/design"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

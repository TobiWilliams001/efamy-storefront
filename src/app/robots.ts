import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/format";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Neither is useful in an index, and both waste crawl budget.
      disallow: ["/cart", "/checkout", "/design"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

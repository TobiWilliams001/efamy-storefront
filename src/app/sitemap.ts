import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/lib/catalogue";
import { absoluteUrl } from "@/lib/format";
import { routes } from "@/lib/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const staticRoutes = [
    { path: routes.home, priority: 1 },
    { path: routes.shop, priority: 0.9 },
    { path: routes.about, priority: 0.7 },
    { path: routes.stockists, priority: 0.6 },
    { path: routes.contact, priority: 0.6 },
    { path: routes.returns, priority: 0.3 },
    { path: routes.privacy, priority: 0.3 },
    { path: routes.terms, priority: 0.3 },
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(routes.category(category.slug)),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(routes.product(product.slug)),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

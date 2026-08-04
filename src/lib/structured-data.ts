import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Product } from "@/types/product";

/**
 * `JSON.stringify` does not escape characters that can break out of a script
 * tag, so every payload goes through this before being written to the DOM.
 */
export function serialiseJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organisationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    ...(siteConfig.contact.email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            email: siteConfig.contact.email,
            contactType: "customer service",
            areaServed: "GB",
          },
        }
      : {}),
    ...(Object.values(siteConfig.social).some(Boolean)
      ? { sameAs: Object.values(siteConfig.social).filter(Boolean) }
      : {}),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteUrl(product.image.url),
    sku: product.id,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(product.size ? { weight: product.size } : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(routes.product(product.slug)),
      priceCurrency: siteConfig.currency,
      price: (product.price / 100).toFixed(2),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: siteConfig.legalName },
    },
  };
}

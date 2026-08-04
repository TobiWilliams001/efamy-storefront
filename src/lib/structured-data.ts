import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Faq } from "@/lib/faqs";
import { inStock, type Product } from "@/types/product";

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

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteUrl(product.image.url),
    sku: product.id,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "AggregateOffer",
      url: absoluteUrl(routes.product(product.slug)),
      priceCurrency: siteConfig.currency,
      lowPrice: (
        Math.min(...product.variants.map((v) => v.price)) / 100
      ).toFixed(2),
      highPrice: (
        Math.max(...product.variants.map((v) => v.price)) / 100
      ).toFixed(2),
      offerCount: product.variants.length,
      availability: inStock(product)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: siteConfig.legalName },
    },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

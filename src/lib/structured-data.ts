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

export function recipeSchema(recipe: {
  title: string;
  summary: string;
  slug: string;
  serves: number;
  prepMinutes: number;
  cookMinutes: number;
  ingredients: string[];
  method: string[];
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.summary,
    url: absoluteUrl(routes.recipe(recipe.slug)),
    ...(recipe.image ? { image: absoluteUrl(recipe.image) } : {}),
    recipeYield: `${recipe.serves} servings`,
    prepTime: `PT${recipe.prepMinutes}M`,
    cookTime: `PT${recipe.cookMinutes}M`,
    totalTime: `PT${recipe.prepMinutes + recipe.cookMinutes}M`,
    recipeCuisine: "Ghanaian",
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.method.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
    author: { "@type": "Organization", name: siteConfig.legalName },
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

/**
 * Breadcrumbs for search engines only.
 *
 * The client asked for the visible "Home / Shop" trail to be removed from every
 * page, and that stands. This gives Google the hierarchy it uses to build the
 * trail shown in results without putting anything back on screen.
 */
export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.path, siteConfig.url).toString(),
    })),
  };
}

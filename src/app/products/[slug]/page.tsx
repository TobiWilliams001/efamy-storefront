import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { AddToCart } from "@/components/cart/add-to-cart";
import { StickyAddToCart } from "@/components/cart/sticky-add-to-cart";
import { HeatBadge } from "@/components/commerce/heat-badge";
import { ProductDetails } from "@/components/commerce/product-details";
import { ProductMedia } from "@/components/commerce/product-media";
import { SelectedVariantProvider } from "@/components/commerce/selected-variant";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Testimonials } from "@/components/sections/testimonials";
import { Section } from "@/components/layout/section";
import { Separator } from "@/components/ui/separator";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { heatLevels, lowestPrice } from "@/types/product";
import {
  breadcrumbSchema,
  productSchema,
  serialiseJsonLd,
} from "@/lib/structured-data";
import { routes } from "@/lib/routes";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: routes.product(product.slug) },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.summary,
      images: [{ url: product.image.url, alt: product.image.alt }],
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd(
            breadcrumbSchema([
              { name: "Home", path: routes.home },
              { name: "Shop", path: routes.shop },
              {
                name: product.category.name,
                path: routes.category(product.category.slug),
              },
              { name: product.name, path: routes.product(product.slug) },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd(productSchema(product)),
        }}
      />

      <Section>
        <SelectedVariantProvider product={product}>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductMedia product={product} />

            <div>
              <h1 className="text-3xl text-balance sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <p data-numeric className="text-2xl font-medium text-brand">
                  {product.variants.length > 1
                    ? `from ${formatPrice(lowestPrice(product))}`
                    : formatPrice(product.variants[0].price)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {product.variants.length > 1
                    ? `${product.variants.length} sizes available`
                    : product.variants[0].size}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {heatLevels(product).map((level) => (
                  <HeatBadge key={level} heat={level} />
                ))}
                {product.dietary?.map((claim) => (
                  <span
                    key={claim}
                    className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                  >
                    {claim}
                  </span>
                ))}
              </div>

              {/* Blank-line separated in the catalogue, so it renders as prose
                rather than one unbroken block. */}
              <div className="mt-6 space-y-4 text-pretty text-muted-foreground">
                {product.description.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <Separator className="my-8" />

              <AddToCart product={product} />
              <StickyAddToCart product={product} />

              {product.certifications?.length ? (
                <ul className="mt-7 flex flex-wrap gap-2">
                  {product.certifications.map((scheme) => (
                    <li
                      key={scheme}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium"
                    >
                      {scheme}
                    </li>
                  ))}
                </ul>
              ) : null}

              <ul className="mt-7 space-y-2 text-sm text-muted-foreground">
                {[
                  "Made by hand in Corby, as it has been since 2008",
                  "Secure payment by card, Apple Pay or Google Pay",
                ].map((reason) => (
                  <li key={reason} className="flex items-start gap-2">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-success"
                    />
                    {reason}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-muted-foreground">
                Questions?{" "}
                <Link href={routes.contact} className="underline">
                  Get in touch
                </Link>
                .
              </p>
            </div>
          </div>
        </SelectedVariantProvider>

        <div className="mx-auto max-w-3xl">
          <ProductDetails product={product} />
        </div>
      </Section>

      <Testimonials
        title="What people say"
        description="Reviews from customers who have cooked with this jar."
      />

      <ProductShowcase
        title={`More ${product.category.name.toLowerCase()}`}
        products={related}
        surface="muted"
        action={{
          label: `Shop ${product.category.name.toLowerCase()}`,
          href: routes.category(product.category.slug),
        }}
      />
    </>
  );
}

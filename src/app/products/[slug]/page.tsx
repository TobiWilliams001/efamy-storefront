import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { AddToCart } from "@/components/cart/add-to-cart";
import { HeatBadge } from "@/components/commerce/heat-badge";
import { ProductDetails } from "@/components/commerce/product-details";
import { ProductGallery } from "@/components/commerce/product-gallery";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Section } from "@/components/layout/section";
import { Separator } from "@/components/ui/separator";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { lowestPrice } from "@/types/product";
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

  const trail = [
    { name: "Shop", path: routes.shop },
    {
      name: product.category.name,
      path: routes.category(product.category.slug),
    },
    { name: product.name, path: routes.product(product.slug) },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd(productSchema(product)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd(breadcrumbSchema(trail)),
        }}
      />

      <Section>
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href={routes.shop} className="hover:text-foreground">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={routes.category(product.category.slug)}
                className="hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            image={product.image}
            images={product.images}
            name={product.name}
          />

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
              {product.heat ? <HeatBadge heat={product.heat} /> : null}
              {product.dietary?.map((claim) => (
                <span
                  key={claim}
                  className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                >
                  {claim}
                </span>
              ))}
            </div>

            <p className="mt-6 text-pretty text-muted-foreground">
              {product.description}
            </p>

            <Separator className="my-8" />

            <AddToCart product={product} />

            <ul className="mt-7 space-y-2 text-sm text-muted-foreground">
              {[
                "Authentic Ghanaian recipe",
                "Proudly made in the UK",
                "No artificial preservatives",
              ].map((reason) => (
                <li key={reason} className="flex items-center gap-2">
                  <Check aria-hidden="true" className="size-4 text-sage-ink" />
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

        <div className="mx-auto max-w-3xl">
          <ProductDetails product={product} />
        </div>
      </Section>

      <ProductShowcase
        title={`More ${product.category.name.toLowerCase()}`}
        products={related}
        surface="muted"
        action={{
          label: "View category",
          href: routes.category(product.category.slug),
        }}
      />
    </>
  );
}

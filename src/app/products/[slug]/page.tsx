import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCart } from "@/components/cart/add-to-cart";
import { HeatBadge } from "@/components/commerce/heat-badge";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Section } from "@/components/layout/section";
import { Separator } from "@/components/ui/separator";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
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
  const isDiscounted =
    product.compareAtPrice !== undefined &&
    product.compareAtPrice > product.price;

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
          <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-card">
            <Image
              src={product.image.url}
              alt={product.image.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              preload
              className="object-contain p-8 sm:p-12"
            />
          </div>

          <div>
            <h1 className="text-3xl text-balance sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <p data-numeric className="text-2xl font-medium text-brand">
                {formatPrice(product.price)}
              </p>
              {isDiscounted ? (
                <p
                  data-numeric
                  className="text-lg text-muted-foreground line-through"
                >
                  <span className="sr-only">Was </span>
                  {formatPrice(product.compareAtPrice!)}
                </p>
              ) : null}
              {product.size ? (
                <p
                  data-numeric
                  className="text-xs tracking-wide text-muted-foreground uppercase"
                >
                  {product.size}
                </p>
              ) : null}
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

            <p className="mt-6 text-sm text-muted-foreground">
              UK delivery. Questions?{" "}
              <Link href={routes.contact} className="underline">
                Get in touch
              </Link>
              .
            </p>

            {product.ingredients || product.allergens ? (
              <div className="mt-10 space-y-5 border-t pt-8 text-sm">
                {product.ingredients ? (
                  <div>
                    <h2 className="font-heading font-medium">Ingredients</h2>
                    <p className="mt-2 text-muted-foreground">
                      {product.ingredients.join(", ")}.
                    </p>
                  </div>
                ) : null}
                {product.allergens ? (
                  <div>
                    <h2 className="font-heading font-medium">Allergens</h2>
                    <p className="mt-2 text-muted-foreground">
                      Contains {product.allergens.join(", ")}.
                    </p>
                  </div>
                ) : null}
                <p className="text-muted-foreground">
                  Always check the label on the product you receive before
                  eating.
                </p>
              </div>
            ) : null}
          </div>
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

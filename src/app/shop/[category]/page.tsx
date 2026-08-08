import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageOpen } from "lucide-react";

import { ProductGrid } from "@/components/commerce/product-grid";
import { ShopFilters } from "@/components/commerce/shop-filters";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/catalogue";
import { applyFilters, parseFilters } from "@/lib/product-filters";
import { routes } from "@/lib/routes";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: routes.category(category.slug) },
    openGraph: {
      title: category.name,
      description: category.description,
      images: [category.image.url],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/shop/[category]">) {
  const [{ category: slug }, query] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const filters = { ...parseFilters(query), category: category.slug };
  const visible = applyFilters(products, filters);

  return (
    <>
      <PageHeader
        align="center"
        eyebrow="Shop"
        title={category.name}
        description={category.description}
      />
      <Section spacing="afterHeader">
        <ShopFilters
          categories={categories}
          filters={filters}
          count={visible.length}
          showCategories={false}
        />

        <ProductGrid
          products={visible}
          eagerCount={2}
          empty={
            <EmptyState
              icon={PackageOpen}
              title="Nothing matches those filters"
              description="Try a different heat level, or browse the full range."
              action={
                <Button asChild size="lg" variant="outline">
                  <Link href={routes.shop}>Shop the range</Link>
                </Button>
              }
            />
          }
        />
      </Section>
    </>
  );
}

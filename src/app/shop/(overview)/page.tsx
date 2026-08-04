import type { Metadata } from "next";
import Link from "next/link";
import { PackageOpen } from "lucide-react";

import { ProductGrid } from "@/components/commerce/product-grid";
import { ShopFilters } from "@/components/commerce/shop-filters";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/catalogue";
import { applyFilters, parseFilters } from "@/lib/product-filters";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse every Efamy chilli sauce, chilli oil and seasoning. Small-batch Ghanaian flavour, made in the UK.",
  alternates: { canonical: routes.shop },
};

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const [products, categories, params] = await Promise.all([
    getProducts(),
    getCategories(),
    searchParams,
  ]);

  const filters = parseFilters(params);
  const visible = applyFilters(products, filters);

  return (
    <>
      <PageHeader
        align="center"
        eyebrow="Shop"
        title="The full range"
        description="Every chilli sauce and seasoning we make, in mild and hot."
        breadcrumb={[{ name: "Home", href: routes.home }, { name: "Shop" }]}
      />
      <Section>
        <ShopFilters
          categories={categories}
          filters={filters}
          count={visible.length}
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
                  <Link href={routes.shop}>Clear filters</Link>
                </Button>
              }
            />
          }
        />
      </Section>
    </>
  );
}

import Link from "next/link";

import { ProductGrid } from "@/components/commerce/product-grid";
import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import type { ProductSummary } from "@/types/product";

type ProductShowcaseProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  products: ProductSummary[];
  action?: { label: string; href: string };
  surface?: React.ComponentProps<typeof Section>["surface"];
  eagerCount?: number;
};

export function ProductShowcase({
  eyebrow,
  title,
  description,
  products,
  action,
  surface = "default",
  eagerCount = 0,
}: ProductShowcaseProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <Section surface={surface}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          action ? (
            <Button asChild variant="outline" size="lg">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : undefined
        }
      />
      <ProductGrid products={products} eagerCount={eagerCount} />
    </Section>
  );
}

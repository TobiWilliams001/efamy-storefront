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
  /** Rendered under the grid, inside the same band. */
  children?: React.ReactNode;
};

export function ProductShowcase({
  eyebrow,
  title,
  description,
  products,
  action,
  surface = "default",
  /*
   * Zero by default. On the home page every product row sits below a hero that
   * fills most of a phone screen, so eager-loading cards only competes with the
   * hero for LCP bandwidth. The shop pages set it, because there the products
   * are the first thing on screen.
   */
  eagerCount = 0,
  children,
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
      {children}
    </Section>
  );
}

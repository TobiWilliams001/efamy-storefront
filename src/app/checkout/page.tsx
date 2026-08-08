import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader eyebrow="Checkout" title="Checkout" />
      <Section spacing="afterHeader" width="narrow">
        <EmptyState
          icon={CreditCard}
          title="Order by email"
          description="Send us your basket and we will confirm your order, delivery and payment by return. We usually reply within two working days."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="xl" variant="accent">
                <a
                  href={`mailto:${siteConfig.contact.email}?subject=Order enquiry`}
                >
                  Email your order
                </a>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href={routes.cart}>Back to basket</Link>
              </Button>
            </div>
          }
        />
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

/**
 * Placeholder until Stripe Checkout is connected. Deliberately does not collect
 * any payment or address details. A form that looks real but goes nowhere is
 * worse than an honest message.
 */
export default function CheckoutPage() {
  return (
    <Section width="narrow">
      <SectionHeader as="h1" title="Checkout" className="mb-8" />
      <EmptyState
        icon={CreditCard}
        title="Online payment is being set up"
        description="We are finishing our secure checkout. Until it is live, email us with what you would like and we will arrange your order and delivery."
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
  );
}

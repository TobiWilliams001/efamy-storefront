import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ClearCartOnMount } from "@/app/order/confirmed/clear-cart";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function OrderConfirmedPage() {
  return (
    <>
      <ClearCartOnMount />
      <PageHeader eyebrow="Thank you" title="Your order is in." />
      <Section spacing="afterHeader" width="narrow">
        <div className="rounded-lg bg-card p-8 text-center shadow-card sm:p-10">
          <CheckCircle2
            aria-hidden="true"
            className="mx-auto size-8 text-sage-ink"
            strokeWidth={1.5}
          />
          <p className="mt-5 text-lg text-pretty">
            Stripe has taken your payment and sent a receipt to your email
            address.
          </p>
          <p className="mt-4 text-pretty text-muted-foreground">
            We pack orders Monday to Friday and will be in touch when yours is
            on its way. Any questions, reply to your receipt or email us at{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="underline underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="xl" variant="accent">
              <Link href={routes.shop}>Keep shopping</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href={routes.recipes}>Find a recipe</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

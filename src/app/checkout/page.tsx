import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { CheckoutButton } from "@/app/checkout/checkout-button";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
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
        <div className="rounded-lg bg-card p-8 shadow-card sm:p-10">
          <h2 className="font-heading text-xl">Pay by card</h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Payment is handled by Stripe. You will enter your card details on
            their secure page — they never touch this site. Apple Pay and Google
            Pay are offered where your device supports them.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-sage-ink"
              />
              Delivery is added on the payment page, before you confirm.
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-sage-ink"
              />
              We never see or store your card details.
            </li>
          </ul>

          <div className="mt-8">
            <CheckoutButton />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Prefer to order another way?{" "}
            <a
              href={`mailto:${siteConfig.contact.email}?subject=Order enquiry`}
              className="underline underline-offset-4"
            >
              Email us
            </a>{" "}
            or{" "}
            <Link href={routes.cart} className="underline underline-offset-4">
              go back to your basket
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}

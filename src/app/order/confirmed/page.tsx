import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, TriangleAlert } from "lucide-react";

import { ClearCartOnMount } from "@/app/order/confirmed/clear-cart";
import { PageHeader } from "@/components/layout/page-header";
import { Rule } from "@/components/layout/rule";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { confirmOrder } from "@/lib/order-status";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

const steps = [
  { title: "Order received", description: "We have your order." },
  {
    title: "Preparing your order",
    description: "We pack Monday to Friday.",
  },
  {
    title: "On its way",
    description: "We will email you when it is posted.",
  },
];

export default async function OrderConfirmedPage({
  searchParams,
}: PageProps<"/order/confirmed">) {
  const { session_id: sessionId } = await searchParams;

  // Stripe is asked directly. Landing on this URL is not evidence of anything.
  const status = await confirmOrder(
    typeof sessionId === "string" ? sessionId : undefined,
  );

  if (status !== "paid") {
    return (
      <>
        <PageHeader
          eyebrow="Order"
          title={
            status === "pending" ? "Confirming your payment" : "No order found"
          }
        />
        <Section spacing="afterHeader" width="narrow">
          <div className="rounded-lg bg-card p-8 shadow-card sm:p-10">
            {status === "pending" ? (
              <>
                <Clock
                  aria-hidden="true"
                  className="size-7 text-gold-ink"
                  strokeWidth={1.5}
                />
                <p className="mt-5 text-lg text-pretty">
                  Your payment is still being confirmed.
                </p>
                <p className="mt-4 text-pretty text-muted-foreground">
                  This usually takes a moment. Refresh this page shortly — and
                  if you have been charged, your order is safe. Nothing is lost.
                </p>
              </>
            ) : (
              <>
                <TriangleAlert
                  aria-hidden="true"
                  className="size-7 text-gold-ink"
                  strokeWidth={1.5}
                />
                <p className="mt-5 text-lg text-pretty">
                  We could not find an order for this page.
                </p>
                <p className="mt-4 text-pretty text-muted-foreground">
                  If you were part-way through paying, your basket is still
                  here. If you think you have been charged, email us at{" "}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="underline underline-offset-4"
                  >
                    {siteConfig.contact.email}
                  </a>{" "}
                  and we will check.
                </p>
              </>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link href={routes.cart}>Back to basket</Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href={routes.shop}>Shop the range</Link>
              </Button>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      {/* Only once Stripe has confirmed payment. */}
      <ClearCartOnMount />

      <PageHeader eyebrow="Thank you" title="Your order is in." />

      <Section spacing="afterHeader" width="narrow">
        <div className="rounded-lg bg-card p-8 shadow-card sm:p-10">
          <p className="text-lg text-pretty">
            Thank you for ordering from Efamy. We have received your order and
            will start preparing it for delivery.
          </p>

          <div className="mt-8 flex items-start gap-3 rounded-lg bg-clay/30 p-5">
            <Mail
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-gold-ink"
            />
            <div>
              <h2 className="font-heading text-lg">Order confirmation</h2>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">
                A confirmation and receipt have been sent to your email.
              </p>
            </div>
          </div>

          <h2 className="mt-10 display-title text-lg text-brand">
            What happens next
          </h2>
          <Rule className="mt-4 justify-start" />

          <ol className="mt-6 space-y-5">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  data-numeric
                  aria-hidden="true"
                  className={
                    index === 0
                      ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-sage/20 text-sm font-semibold text-sage-ink"
                      : "flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-muted-foreground"
                  }
                >
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-0.5 text-sm text-pretty text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="xl" variant="accent">
              <Link href={routes.shop}>Continue shopping</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href={routes.recipes}>Discover our recipes</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

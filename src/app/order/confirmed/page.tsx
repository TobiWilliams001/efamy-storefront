import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, TriangleAlert } from "lucide-react";

import { ClearCartOnMount } from "@/app/order/confirmed/clear-cart";
import { TrackPurchase } from "@/app/order/confirmed/track-purchase";
import { PageHeader } from "@/components/layout/page-header";
import { Rule } from "@/components/layout/rule";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { confirmPayment } from "@/lib/payment-status";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

/*
 * No packing schedule, posting day or delivery window until Efamy confirms
 * them. A promise the business has not agreed to is one it can still break.
 */
const steps = [
  { title: "Order received", description: "Your payment has gone through." },
  {
    title: "Preparing your order",
    description: "We pack it by hand and get it ready to send.",
  },
  {
    title: "On its way",
    description: "We will let you know when it leaves us.",
  },
];

export default async function OrderConfirmedPage({
  searchParams,
}: PageProps<"/order/confirmed">) {
  const { session_id: sessionId } = await searchParams;

  // Stripe is asked directly. Landing on this URL is not evidence of anything.
  const payment = await confirmPayment(
    typeof sessionId === "string" ? sessionId : undefined,
  );
  const status = payment.status;

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
                  We are confirming your payment.
                </p>
                <p className="mt-4 text-pretty text-muted-foreground">
                  This usually only takes a moment. Please refresh this page
                  shortly to check your order status. If you have been charged
                  but still do not see your order confirmed, please contact us
                  at {siteConfig.contact.email}.
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
                  We could not find your order.
                </p>
                <p className="mt-4 text-pretty text-muted-foreground">
                  If you did not finish paying, your basket is still here. If
                  you think you have been charged, email us at{" "}
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
      {/* Both only once Stripe has confirmed payment. */}
      <ClearCartOnMount />
      {payment.transactionId ? (
        <TrackPurchase
          transactionId={payment.transactionId}
          value={payment.value ?? 0}
          currency={payment.currency ?? "GBP"}
          shipping={payment.shipping ?? 0}
        />
      ) : null}

      <PageHeader eyebrow="Thank you" title="Order confirmed." />

      <Section spacing="afterHeader" width="narrow">
        <div className="rounded-lg bg-card p-8 shadow-card sm:p-10">
          <p className="text-lg text-pretty">
            Thank you for your order. We have received it and will start getting
            it ready.
          </p>

          <div className="mt-8 flex items-start gap-3 rounded-lg bg-clay/30 p-5">
            <Mail
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-gold-ink"
            />
            {/*
             * The address is shown back rather than described, because the
             * commonest reason a confirmation "never arrives" is a typo in it,
             * and only the customer can spot that. Worded as on its way: this
             * redirect often beats Stripe's webhook, so at this moment the
             * email may genuinely not have been sent yet.
             */}
            <div className="min-w-0">
              <h2 className="font-heading text-lg">Check your email</h2>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">
                We have sent your order confirmation and payment receipt
                {payment.email ? (
                  <>
                    {" "}
                    to{" "}
                    <span className="font-medium break-words text-foreground">
                      {payment.email}
                    </span>
                  </>
                ) : null}
                . They should arrive within a few minutes. If you do not see
                them, please check your spam or junk folder.
              </p>
              {payment.transactionId ? (
                <div className="mt-4">
                  <p className="text-sm font-medium">Order reference</p>
                  <p className="mt-1 font-mono text-xs break-all text-muted-foreground">
                    {payment.transactionId}
                  </p>
                </div>
              ) : null}
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
                      ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-success-bg text-sm font-semibold text-success"
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

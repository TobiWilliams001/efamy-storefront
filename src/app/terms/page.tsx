import type { Metadata } from "next";

import { Prose } from "@/components/common/prose";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { siteConfig } from "@/config/site";
import { delivery } from "@/config/delivery";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms on which ${siteConfig.legalName} sells through this website.`,
  alternates: { canonical: routes.terms },
};

/*
 * Written from what the site actually does, and nothing else. Every figure and
 * company detail on this page is read from config, so it cannot drift from the
 * shop, and no clause states a legal position the business has not taken.
 */
export default function TermsPage() {
  const { address, legalName, companyNumber, vatNumber, contact } = siteConfig;

  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms &amp; Conditions" />
      <Section spacing="afterHeader" width="prose">
        <Prose>
          <h2>Who you are buying from</h2>
          <p>
            This website is operated by {legalName}, a company registered in
            England and Wales, company number {companyNumber}, VAT registration{" "}
            {vatNumber}. Our address is {address.line1}, {address.line2},{" "}
            {address.town} {address.postcode}. You can reach us at{" "}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>.
          </p>

          <h2>Placing an order</h2>
          <p>
            Add what you want to your basket and pay at the checkout. Prices are
            recalculated from our catalogue when you check out, so what you are
            charged is always the price we are currently selling at, whatever
            your basket may have remembered from an earlier visit.
          </p>
          <p>
            We will let you know if we cannot fulfil an order, for example if an
            item sells out between you ordering and us packing. If that happens
            you are refunded in full.
          </p>

          <h2>Prices and payment</h2>
          <p>
            Prices are in pounds sterling. Delivery is added at the checkout and
            shown before you pay, so the total on the payment page is the total
            you are charged.
          </p>
          <p>
            Payment is handled by Stripe. Your card details are entered on
            Stripe&rsquo;s payment page and never reach our servers, so we do
            not see or store your card number.
          </p>

          <h2>Delivery</h2>
          <p>
            We deliver to the United Kingdom. Standard delivery is{" "}
            {formatPrice(delivery.standardRate)}, added at the checkout. We will
            tell you when your order leaves us.
          </p>

          <h2>Your rights</h2>
          <p>
            Nothing on this page reduces the rights you have by law. If
            something arrives damaged, incorrect, or not as described, tell us
            and we will put it right. Our{" "}
            <a href={routes.returns}>returns page</a> explains how.
          </p>

          <h2>This website</h2>
          <p>
            The text, photographs and design on this site belong to us. You are
            welcome to share links to it. Please do not copy the content for
            commercial use without asking first.
          </p>
          <p>
            We keep the site accurate and available as best we can, and we
            update these terms when the way we sell changes.
          </p>

          <h2>Getting in touch</h2>
          <p>
            Questions about an order, or about anything here, go to{" "}
            <a href={`mailto:${contact.email}`}>{contact.email}</a> and a person
            will answer.
          </p>
        </Prose>
      </Section>
    </>
  );
}

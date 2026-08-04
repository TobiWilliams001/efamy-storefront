import type { Metadata } from "next";

import { DraftNotice } from "@/components/common/draft-notice";
import { Prose } from "@/components/common/prose";
import { Section, SectionHeader } from "@/components/layout/section";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms on which ${siteConfig.legalName} sells through this website.`,
  alternates: { canonical: routes.terms },
};

export default function TermsPage() {
  return (
    <Section width="prose">
      <SectionHeader as="h1" title="Terms &amp; Conditions" className="mb-8" />

      <DraftNotice>
        <strong>Draft, not legally reviewed.</strong> These are the headings a
        UK consumer sales contract needs. They are not enforceable terms and
        must be written and checked by someone qualified before launch.
      </DraftNotice>

      <Prose>
        <h2>Who we are</h2>
        <p>
          Add the registered company name, company number, registered office and
          VAT number for {siteConfig.legalName}. Consumers are entitled to this
          information before they buy.
        </p>

        <h2>Placing an order</h2>
        <p>
          Explain when the contract is formed, typically on dispatch rather than
          at payment, and reserve the right to decline an order, for example
          where stock or pricing was wrong.
        </p>

        <h2>Prices and payment</h2>
        <p>
          Confirm whether prices include VAT, which payment methods are
          accepted, and when payment is taken. Delivery charges must be shown
          before the customer commits.
        </p>

        <h2>Delivery</h2>
        <p>
          State the areas served, delivery timescales and charges. Under the
          Consumer Rights Act, delivery must happen within 30 days unless
          another period is agreed.
        </p>

        <h2>Cancellation and returns</h2>
        <p>
          Distance selling gives a 14-day right to cancel, but perishable food
          and sealed goods unsuitable for return once opened carry exemptions.
          Which apply to our products needs confirming. See our{" "}
          <a href={routes.returns}>returns page</a>.
        </p>

        <h2>Faulty or incorrect items</h2>
        <p>
          Set out how to report a problem and the remedies available under the
          Consumer Rights Act 2015. Nothing here can reduce a consumer&apos;s
          statutory rights.
        </p>

        <h2>Allergens and product information</h2>
        <p>
          Product pages list ingredients and allergens as printed on the
          packaging, but customers should always check the label on the item
          they receive. Confirm the wording with whoever handles food labelling
          compliance.
        </p>

        <h2>Liability</h2>
        <p>
          Limitations must not exclude liability for death or personal injury
          caused by negligence, fraud, or anything else that cannot lawfully be
          excluded.
        </p>

        <h2>Governing law</h2>
        <p>
          State which law applies and which courts have jurisdiction, and how
          complaints are handled.
        </p>
      </Prose>
    </Section>
  );
}

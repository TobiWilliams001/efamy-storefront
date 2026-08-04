import type { Metadata } from "next";

import { DraftNotice } from "@/components/common/draft-notice";
import { Prose } from "@/components/common/prose";
import { Section, SectionHeader } from "@/components/layout/section";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Returns",
  description: `How returns and refunds work when you order from ${siteConfig.legalName}.`,
  alternates: { canonical: routes.returns },
};

export default function ReturnsPage() {
  return (
    <Section width="prose">
      <SectionHeader as="h1" title="Returns &amp; Refunds" className="mb-8" />

      <DraftNotice>
        <strong>Draft, not legally reviewed.</strong> Food returns are not
        straightforward: perishable and sealed food carries specific exemptions
        from the usual 14-day right to cancel. The policy below must be
        confirmed with someone qualified before launch.
      </DraftNotice>

      <Prose>
        <h2>Something wrong with your order</h2>
        <p>
          If an item arrives damaged, incorrect, or past its best before date,
          contact us with your order number and a photograph and we will put it
          right. This applies regardless of anything else on this page, because
          statutory rights cannot be signed away.
        </p>

        <h2>Changing your mind</h2>
        <p>
          Under the Consumer Contracts Regulations, online orders normally carry
          a 14-day right to cancel. Food that can spoil quickly, and sealed
          goods that are not suitable for return once opened on health grounds,
          are exempt. Which of our products fall under each exemption needs
          confirming before this section can be written.
        </p>

        <h2>How to start a return</h2>
        <p>
          Set out the contact route, the timeframe, whether the customer or we
          pay return postage, and the return address.
        </p>

        <h2>Refunds</h2>
        <p>
          Refunds go back to the original payment method. State the processing
          time. The regulations require refunds within 14 days of receiving the
          goods back or proof of return.
        </p>

        <h2>Delivery problems</h2>
        <p>
          Explain what happens if a parcel is delayed, lost, or shows as
          delivered but has not arrived, and how long customers should wait
          before contacting us.
        </p>

        <h2>Contact</h2>
        <p>
          Email{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>{" "}
          or use our <a href={routes.contact}>contact form</a>.
        </p>
      </Prose>
    </Section>
  );
}

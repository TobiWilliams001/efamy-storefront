import type { Metadata } from "next";

import { DraftNotice } from "@/components/common/draft-notice";
import { Prose } from "@/components/common/prose";
import { Section, SectionHeader } from "@/components/layout/section";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.legalName} collects and uses personal data.`,
  alternates: { canonical: routes.privacy },
};

export default function PrivacyPage() {
  return (
    <Section width="prose">
      <SectionHeader as="h1" title="Privacy Policy" className="mb-8" />

      <DraftNotice>
        <strong>Draft, not legally reviewed.</strong> This outlines what a UK
        GDPR compliant policy must cover. It must be completed and checked by
        someone qualified before launch, and the sections below are prompts
        rather than a policy.
      </DraftNotice>

      <Prose>
        <h2>Who we are</h2>
        <p>
          {siteConfig.legalName} is the data controller for personal data
          collected through this website. Add the registered company name,
          company number, registered address and ICO registration number here.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            Details you give us: name, email address, delivery address and phone
            number when you order or contact us.
          </li>
          <li>
            Order information: what you bought, when, and the amount paid. Card
            details are handled by our payment provider and never reach our
            servers.
          </li>
          <li>
            Usage data: pages visited and interactions, collected through
            analytics. Confirm the cookie consent approach before enabling.
          </li>
        </ul>

        <h2>Why we use it, and our lawful basis</h2>
        <p>
          Each purpose needs a stated lawful basis under UK GDPR: performing the
          contract to fulfil orders, legitimate interests for fraud prevention
          and service improvement, consent for marketing email and non-essential
          cookies, and legal obligation for tax records.
        </p>

        <h2>Who we share it with</h2>
        <p>
          List every processor, including payment provider, email provider,
          hosting and analytics, and note any transfers outside the UK together
          with the safeguard relied on.
        </p>

        <h2>How long we keep it</h2>
        <p>
          State a retention period for each category. Order and tax records are
          generally kept six years; marketing consent should be reviewed
          regularly.
        </p>

        <h2>Your rights</h2>
        <p>
          Cover the right of access, rectification, erasure, restriction,
          portability, and objection, including objecting to direct marketing.
          Give the contact route for exercising them and the right to complain
          to the Information Commissioner&apos;s Office.
        </p>

        <h2>Cookies</h2>
        <p>
          Analytics and marketing cookies require consent before they are set.
          If Google Analytics or a Meta Pixel is enabled, a consent mechanism is
          needed and this section must describe it.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy can be sent to{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </Prose>
    </Section>
  );
}

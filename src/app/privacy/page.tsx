import type { Metadata } from "next";

import { Prose } from "@/components/common/prose";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.legalName} collects and uses personal data.`,
  alternates: { canonical: routes.privacy },
};

/*
 * A description of what this site actually does with data, taken from the code
 * rather than from a template. Every processor named here is one the site
 * genuinely calls; nothing claims a retention period nobody has set.
 */
export default function PrivacyPage() {
  const { address, legalName, companyNumber, contact } = siteConfig;

  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <Section spacing="afterHeader" width="prose">
        <Prose>
          <h2>Who we are</h2>
          <p>
            {legalName}, company number {companyNumber}, of {address.line1},{" "}
            {address.line2}, {address.town} {address.postcode}. For anything on
            this page, write to{" "}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>.
          </p>

          <h2>What we collect, and when</h2>
          <p>
            <strong>When you write to us.</strong> The contact form asks for
            your name, your email address and your message. We use them to
            answer you, and nothing else.
          </p>
          <p>
            <strong>When you order.</strong> Checkout collects your name, email
            address, delivery address and phone number, because we cannot post a
            parcel without them. Your card details are entered on Stripe&rsquo;s
            payment page and never reach us.
          </p>
          <p>
            <strong>When you browse.</strong> Your basket is stored in your own
            browser, not on our servers, so it is still there when you come
            back. Clearing your browser data clears it.
          </p>

          <h2>Who else handles it</h2>
          <p>We use a small number of companies to run the shop:</p>
          <ul>
            <li>
              <strong>Stripe</strong> takes payments and holds the order record.
            </li>
            <li>
              <strong>Resend</strong> delivers the emails we send you, such as
              your order confirmation.
            </li>
            <li>
              <strong>Zoho Mail</strong> hosts the inbox your messages arrive
              in.
            </li>
            <li>
              <strong>Vercel</strong> hosts this website.
            </li>
            <li>
              <strong>Sanity</strong> stores the product descriptions and
              photographs you see.
            </li>
          </ul>
          <p>
            We do not sell your data, and we do not share it with anyone for
            advertising.
          </p>

          <h2>Cookies</h2>
          <p>
            The site sets what it needs to work: your basket, and your answer to
            the cookie banner so it stops asking. Analytics only runs if you
            accept it, and you can decline without losing anything.
          </p>

          <h2>Your data is yours</h2>
          <p>
            You can ask us what we hold about you, ask us to correct it, or ask
            us to delete it. Write to{" "}
            <a href={`mailto:${contact.email}`}>{contact.email}</a> and we will
            deal with it. If you are unhappy with how we have handled a request,
            you can raise it with the Information Commissioner&rsquo;s Office at{" "}
            <a href="https://ico.org.uk" target="_blank" rel="noreferrer">
              ico.org.uk
            </a>
            .
          </p>
          <p>
            We keep order records for as long as the law requires us to keep
            business accounts, and we do not keep anything else longer than we
            need it.
          </p>
        </Prose>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { Mail, MessageCircle, Store } from "lucide-react";

import { ContactForm } from "@/app/contact/contact-form";
import { Section, SectionHeader } from "@/components/layout/section";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.legalName} about orders, stockists or wholesale.`,
  alternates: { canonical: routes.contact },
};

export default function ContactPage() {
  const { email, phone, whatsapp } = siteConfig.contact;

  return (
    <Section>
      <SectionHeader
        as="h1"
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about an order, our products, or stocking Efamy? Send us a message and we will come back to you."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <ContactForm />

        <aside className="space-y-8 text-sm">
          <div>
            <h2 className="font-heading text-base">Email</h2>
            <a
              href={`mailto:${email}`}
              className="mt-2 inline-flex items-center gap-2 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <Mail aria-hidden="true" className="size-4" />
              {email}
            </a>
          </div>

          {phone ? (
            <div>
              <h2 className="font-heading text-base">Phone</h2>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="mt-2 inline-block text-muted-foreground hover:text-foreground"
              >
                {phone}
              </a>
            </div>
          ) : null}

          {whatsapp ? (
            <div>
              <h2 className="font-heading text-base">WhatsApp</h2>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-flex items-center gap-2 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                Message us on WhatsApp
              </a>
            </div>
          ) : null}

          <div>
            <h2 className="font-heading text-base">Stockists</h2>
            <p className="mt-2 text-muted-foreground">
              Interested in stocking Efamy?{" "}
              <a
                href={routes.stockists}
                className="underline underline-offset-4 hover:text-foreground"
              >
                See our stockist page
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-heading text-base">Response time</h2>
            <p className="mt-2 flex items-start gap-2 text-muted-foreground">
              <Store aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              We aim to reply within two working days.
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}

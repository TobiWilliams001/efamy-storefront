import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock, Mail, MessageCircle, Phone, Store } from "lucide-react";

import { ContactForm } from "@/app/contact/contact-form";
import { FaqList } from "@/components/common/faq-list";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import { siteConfig } from "@/config/site";
import { contactFaqs } from "@/lib/faqs";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.legalName} about orders, stockists or wholesale.`,
  alternates: { canonical: routes.contact },
};

export default function ContactPage() {
  const { email, phone, whatsapp } = siteConfig.contact;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about an order, our products, or stocking Efamy? Send us a message and a real person will come back to you."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          <div className="rounded-lg bg-card p-6 shadow-card sm:p-10">
            <h2 className="font-heading text-xl">Send us a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              All fields are required.
            </p>
            <ul className="mt-5 mb-8 space-y-2 text-sm text-muted-foreground">
              {[
                "Order help: problems, changes or anything that arrived wrong.",
                "Product questions: heat levels, ingredients and allergens.",
                "Wholesale: trade pricing and case quantities for retailers.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-sage-ink"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <ContactForm />
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-lg bg-clay/40 p-6">
              <h2 className="font-heading text-lg">
                Prefer to write directly?
              </h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-3 underline-offset-4 hover:underline"
                  >
                    <Mail
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-gold-ink"
                    />
                    {email}
                  </a>
                </li>
                {phone ? (
                  <li>
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="flex items-start gap-3 underline-offset-4 hover:underline"
                    >
                      <Phone
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-gold-ink"
                      />
                      {phone}
                    </a>
                  </li>
                ) : null}
                {whatsapp ? (
                  <li>
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-start gap-3 underline-offset-4 hover:underline"
                    >
                      <MessageCircle
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-gold-ink"
                      />
                      Message us on WhatsApp
                    </a>
                  </li>
                ) : null}
                <li className="flex items-start gap-3 text-muted-foreground">
                  <Clock
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-gold-ink"
                  />
                  We reply within two working days, Monday to Friday.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 p-6">
              <Store
                aria-hidden="true"
                className="size-5 text-gold-ink"
                strokeWidth={1.75}
              />
              <h2 className="mt-4 font-heading text-lg">Stock Efamy</h2>
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                We supply independent retailers and grocers across the UK. Ask
                us for trade pricing and case quantities.
              </p>
              <Link
                href={routes.stockists}
                className="mt-4 inline-block text-sm underline underline-offset-4"
              >
                Stockists &amp; wholesale
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      <Section surface="muted" spacing="sm">
        <SectionHeader
          align="center"
          title="Before you write"
          description="The four things people ask most. If yours is not here, the form above reaches a real person."
        />
        <div className="mx-auto max-w-3xl">
          <FaqList faqs={contactFaqs} />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            <Link href={routes.faq} className="underline underline-offset-4">
              Read all frequently asked questions
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone, Store } from "lucide-react";

import { Rule } from "@/components/layout/rule";
import { ContactForm } from "@/app/contact/contact-form";
import { FaqList } from "@/components/common/faq-list";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { contactFaqs } from "@/lib/faqs";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.legalName} about orders, stockists or wholesale.`,
  alternates: { canonical: routes.contact },
};

export default function ContactPage() {
  const { email, phone, whatsapp, hours } = siteConfig.contact;
  const { line1, line2, town, postcode } = siteConfig.address;

  return (
    <>
      <PageHeader
        tone="ink"
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about an order, our products, or stocking Efamy? Send us a message and a real person will come back to you."
      />

      <section className="relative overflow-hidden bg-background">
        {/*
         * The photograph bleeds off the right edge on wide screens and drops to
         * a band above the content on narrow ones, so it never squeezes the
         * form into a column too tight to type in.
         */}
        <div className="relative h-56 sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[38%]">
          <Image
            src="/dishes/jollof-rice.jpg"
            alt="A plate of jollof rice cooked with Efamy chilli sauce"
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover"
          />
          {/* Feathers the seam so the panel reads as part of the page. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-background to-transparent lg:bg-linear-to-r"
          />
        </div>

        <Container>
          <div className="py-14 lg:w-[58%] lg:py-20 lg:pr-10">
            <h2 className="display-title text-2xl text-brand sm:text-3xl">
              Our details
            </h2>
            <Rule className="mt-5 justify-start" />

            <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-12">
              <div>
                <ul className="space-y-5 text-sm">
                  {phone ? (
                    <li>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="flex min-h-11 items-center gap-3 underline-offset-4 hover:underline sm:min-h-0 sm:items-start"
                      >
                        <Phone
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-gold-ink"
                        />
                        {phone}
                      </a>
                    </li>
                  ) : null}
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="flex min-h-11 items-center gap-3 underline-offset-4 hover:underline sm:min-h-0 sm:items-start"
                    >
                      <Mail
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-gold-ink"
                      />
                      {email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-gold-ink"
                    />
                    <address className="not-italic">
                      {siteConfig.legalName}
                      <br />
                      {line1}
                      <br />
                      {line2 ? (
                        <>
                          {line2}
                          <br />
                        </>
                      ) : null}
                      {town} {postcode}
                    </address>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <Clock
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-gold-ink"
                    />
                    {hours}
                  </li>
                </ul>

                {whatsapp ? (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-7 inline-flex size-11 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover"
                  >
                    <MessageCircle aria-hidden="true" className="size-5" />
                    <span className="sr-only">Message us on WhatsApp</span>
                  </a>
                ) : null}
              </div>

              <ContactForm />
            </div>

            <div className="mt-12 rounded-lg border border-neutral-200 p-6">
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
                className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4 sm:min-h-0"
              >
                Stockists &amp; wholesale
              </Link>
            </div>
          </div>
        </Container>
      </section>

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

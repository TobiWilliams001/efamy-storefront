import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Handshake,
  Headset,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareHeart,
  Phone,
  Store,
} from "lucide-react";

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

/*
 * Three reasons people write, so someone scanning the page can see their own
 * situation before they start typing. Wording stays inside what Efamy has
 * actually agreed: no reply-time promise, because none has been confirmed.
 */
const reasons = [
  {
    icon: Headset,
    title: "Customer support",
    description:
      "A question about an order, a jar, or what is in it. Tell us what you need and we will sort it.",
  },
  {
    icon: Handshake,
    title: "Partnerships",
    description:
      "Shops, caterers and anyone who wants to carry the range. We will send trade pricing and case quantities.",
  },
  {
    icon: MessageSquareHeart,
    title: "Feedback",
    description:
      "What you cooked, what worked, what did not. Fifteen years of recipes came from people telling us.",
  },
];

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.legalName} about orders, stockists or wholesale.`,
  alternates: { canonical: routes.contact },
};

export default function ContactPage() {
  const { email, phone, whatsapp, hours } = siteConfig.contact;
  const address = siteConfig.address;
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
         * The photograph bleeds off the right edge on wide screens and becomes
         * a band above the content on tablets. On a phone it is gone: the form
         * is what someone came for, and a band above it only pushes the first
         * field further down the screen.
         */}
        <div className="relative hidden sm:block sm:h-56 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[30%]">
          <Image
            src="/products/collections/range-lineup.jpg"
            alt="The Efamy range: chilli sauces, chilli oils and seasonings"
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover"
          />
          {/*
           * Two layers, because the seam and the tint are different jobs.
           * Fading the seam itself to burgundy drew the hard edge it was meant
           * to remove: the home page can fade to maroon only because the panel
           * beside it is maroon, and this one meets white page.
           *
           * Burgundy enters from the outer edge, the one running off screen.
           */}
          <span
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-linear-to-b from-brand/60 via-transparent to-transparent lg:bg-linear-to-l"
          />
          {/* And the seam fades to page white: the bottom edge when the
              photograph sits above the form, the left edge when it sits beside
              it. One colour, direction flipped. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-linear-to-t from-background via-transparent to-transparent lg:bg-linear-to-r"
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

      <Section spacing="sm">
        <SectionHeader align="center" title="Find us" />

        <div className="mx-auto max-w-3xl">
          {/*
           * OpenStreetMap rather than Google: it needs no API key and sets no
           * cookies, so the map is not a tracker the consent banner has to ask
           * about before the page can draw itself. Coordinates are the geocoded
           * postcode, not a guess.
           */}
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <iframe
              title={`Map showing ${siteConfig.legalName} in ${address.town}`}
              src="https://www.openstreetmap.org/export/embed.html?bbox=-0.6837,52.4896,-0.6637,52.4996&layer=mapnik&marker=52.4946,-0.6737"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full border-0 sm:h-96"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <address className="text-sm text-muted-foreground not-italic">
              <span className="font-medium text-foreground">
                {siteConfig.legalName}
              </span>
              <br />
              {address.line1}
              {address.line2 ? (
                <>
                  <br />
                  {address.line2}
                </>
              ) : null}
              <br />
              {address.town} {address.postcode}
            </address>

            <a
              href={`https://www.openstreetmap.org/?mlat=52.4946&mlon=-0.6737#map=16/52.4946/-0.6737`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 sm:min-h-0"
            >
              Open in maps
            </a>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader align="center" title="We are here to help" />

        <ul className="grid gap-8 sm:grid-cols-3">
          {reasons.map(({ icon: Icon, title, description }) => (
            <li key={title}>
              <span className="flex size-11 items-center justify-center rounded-full border border-gold/60">
                <Icon
                  aria-hidden="true"
                  className="size-5 text-gold-ink"
                  strokeWidth={1.5}
                />
              </span>
              <h3 className="mt-4 font-heading text-lg">{title}</h3>
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ul>
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

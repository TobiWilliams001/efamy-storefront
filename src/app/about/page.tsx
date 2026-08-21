import type { Metadata } from "next";
import Image from "next/image";
import { Flame, Leaf, Utensils } from "lucide-react";

import { Hero } from "@/components/sections/hero";
import { Rule } from "@/components/layout/rule";
import { Section, SectionHeader } from "@/components/layout/section";
import { CallToAction } from "@/components/sections/call-to-action";
import { WhyEfamy } from "@/components/sections/why-efamy";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "About",
  description: `Ghanaian chilli sauces and seasonings, made in Corby since 2008. Real meat, poultry, beans and fish, with no colours or preservatives.`,
  alternates: { canonical: routes.about },
};

const milestones = [
  {
    year: "2008",
    title: "The first batch",
    description:
      "On 30 December we made our first chilli sauce in Kettering and sold it to friends and family. They came back for more, which was all the encouragement we needed.",
  },
  {
    year: "2010",
    title: "Seasonings, by request",
    description:
      "Customers kept asking for the blend we cooked with, so we jarred it as the All Purpose Seasoning Mix. Coat & Cook followed shortly after.",
  },
  {
    year: "2015",
    title: "Kelewele Seasoning",
    description:
      "In December we made our first Kelewele Seasoning: spices, negro pepper, chilli powder and crushed chilli peppers for spiced fried plantain.",
  },
];

/*
 * Efamy's own photographs of their own kitchen. Captions describe only what is
 * in the frame — the photographs are here to be evidence, and a caption that
 * claims more than the picture shows undoes the point of using them.
 */
const kitchen = [
  {
    src: "/photos/finished-trays.jpg",
    alt: "Stacked trays of finished Efamy jars, sorted into colours by flavour",
    caption: "Trayed up by flavour once they are filled.",
  },
  {
    src: "/photos/production-room.jpg",
    alt: "Trays of filled jars and bottles of chilli oil across a production room",
    caption: "Jars and bottles, filled and waiting.",
  },
  {
    src: "/photos/stockroom.jpg",
    alt: "Stockroom shelves holding the Efamy range: chilli oils, sauces and seasonings",
    caption: "The stockroom in Corby.",
  },
];

const strengths = [
  {
    name: "Mild",
    description: "Warmth rather than burn. For children and anyone new to it.",
  },
  {
    name: "Hot",
    description: "A proper, lingering heat for cooks who already use chilli.",
  },
  {
    name: "Extra hot",
    description: "The full strength, for people who mean it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        size="compact"
        title={
          <>
            It began with
            <br />
            <span className="text-gold">one batch, in 2008.</span>
          </>
        }
        description="The taste of Ghana, made in Corby. Authentic recipes. Simple ingredients. No shortcuts, just the way we would make it at home."
      />

      <Section>
        <SectionHeader
          align="center"
          title="Our story"
          description="Three dates that made the range what it is."
        />

        <ol className="relative grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* The thread the milestones hang from; decorative, so it is hidden
              from assistive tech and only drawn where the row is horizontal. */}
          <span
            aria-hidden="true"
            className="absolute top-3 right-0 left-0 hidden h-px bg-gold/35 lg:block"
          />

          {milestones.map((milestone) => (
            <li key={milestone.year} className="relative">
              <span
                aria-hidden="true"
                className="mb-6 block size-3 rotate-45 bg-gold"
              />
              <p
                data-numeric
                className="display-title text-2xl text-gold-ink sm:text-3xl"
              >
                {milestone.year}
              </p>
              <h3 className="mt-3 font-heading text-xl">{milestone.title}</h3>
              <p className="mt-3 text-pretty text-muted-foreground">
                {milestone.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-2xl text-lg text-pretty text-muted-foreground">
          Everything is still made to those recipes. We keep looking for ways to
          make them better, and none of them involve making them cheaper.
        </p>
      </Section>

      <Section>
        <SectionHeader
          align="center"
          eyebrow="In Corby"
          title="Where it is made"
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {kitchen.map((shot) => (
            <li key={shot.src}>
              <figure>
                <div className="relative aspect-4/3 overflow-hidden rounded-lg shadow-card">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
                  {shot.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeader align="center" title="What goes in the jar" />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-lg bg-card p-8 shadow-card sm:p-10">
            <Utensils
              aria-hidden="true"
              className="size-6 text-gold-ink"
              strokeWidth={1.5}
            />
            <h3 className="mt-5 font-heading text-2xl">Our chilli sauces</h3>
            <Rule className="mt-4 justify-start" />
            <p className="mt-6 text-pretty text-muted-foreground">
              Seven flavours made from real meat, poultry, beans and fish, and
              you can see it. Our sauces carry chunks rather than a smooth
              paste. Fresh ginger, garlic and onions are the main ingredients,
              and the oils are vegetable oil and extra virgin olive oil.
            </p>
            <p className="mt-4 text-pretty text-muted-foreground">
              Spoon them over rice, chips, pasta or couscous, stir them through
              a salad, or take a jar to a barbecue and watch it disappear.
            </p>
          </div>

          <div className="rounded-lg bg-card p-8 shadow-card sm:p-10">
            <Leaf
              aria-hidden="true"
              className="size-6 text-gold-ink"
              strokeWidth={1.5}
            />
            <h3 className="mt-5 font-heading text-2xl">Our seasonings</h3>
            <Rule className="mt-4 justify-start" />
            <p className="mt-6 text-pretty text-muted-foreground">
              Made mainly from natural ingredients including ginger and garlic
              powder, spices and chilli peppers.
            </p>
            <p className="mt-4 text-pretty text-muted-foreground">
              An All Purpose blend for meat, fish and chicken, a Kelewele mix
              for spiced fried plantain, and Coat &amp; Cook for a crisp
              coating.
            </p>
          </div>
        </div>

        <figure className="mx-auto mt-12 max-w-xl">
          <div className="relative aspect-5/4 overflow-hidden rounded-lg shadow-card">
            <Image
              src="/products/collections/range-group-shot.jpg"
              alt="The Efamy range together: chilli sauces, chilli oils and seasonings"
              fill
              sizes="(min-width: 640px) 576px, 100vw"
              className="object-cover"
            />
          </div>
        </figure>

        <p className="mt-8 text-center text-lg font-medium text-brand">
          No colours, additives or preservatives added.
        </p>
      </Section>

      <Section>
        <SectionHeader
          align="center"
          title="On heat"
          description="Heat is a preference, not a test. The recipe underneath is the same every time, so the gentler jar never means less flavour."
        />

        <ul className="grid gap-6 sm:grid-cols-3 lg:gap-8">
          {strengths.map((strength, index) => (
            <li
              key={strength.name}
              className="rounded-lg border border-neutral-200 p-8 text-center"
            >
              <span className="flex justify-center gap-1">
                {Array.from({ length: index + 1 }, (_, i) => (
                  <Flame
                    key={i}
                    aria-hidden="true"
                    className="size-5 text-brand"
                  />
                ))}
              </span>
              <h3 className="mt-4 font-heading text-xl">{strength.name}</h3>
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                {strength.description}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <WhyEfamy />
      <CallToAction surface="default" />
    </>
  );
}

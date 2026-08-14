import Image from "next/image";
import { Flame, Leaf, MapPin, Utensils } from "lucide-react";

import { Rule } from "@/components/layout/rule";
import { Section } from "@/components/layout/section";

const reasons = [
  {
    icon: Leaf,
    title: "Premium ingredients",
    description:
      "Fresh ginger, garlic and onions, with vegetable and extra virgin olive oil. Nothing artificial.",
  },
  {
    icon: Utensils,
    title: "Meat and fish you can see",
    description:
      "Our sauces carry real chunks rather than a smooth paste, which is what makes them a meal and not a condiment.",
  },
  {
    icon: MapPin,
    title: "Made in the UK",
    description:
      "Produced in Corby to the same recipes we started with in 2008, and shipped from here.",
  },
  {
    icon: Flame,
    title: "A strength for everyone",
    description:
      "Mild, hot and extra hot from the same recipe, so a table with different tastes shares the same meal.",
  },
];

/*
 * A stand-in from the existing photography. The brief for the shot that belongs
 * here is in docs/photography-brief.md; swap the src when it arrives.
 */
const feature = {
  src: "/dishes/rice-stew.jpg",
  alt: "A bowl of rice and stew made with Efamy chilli sauce",
};

export function WhyEfamy() {
  return (
    <Section surface="muted">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="display-title text-2xl text-brand sm:text-3xl lg:text-4xl">
            Why choose Efamy?
          </h2>
          <Rule className="mt-5 justify-start" />

          <ul className="mt-10 space-y-8">
            {reasons.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-background">
                  <Icon
                    aria-hidden="true"
                    className="size-5 text-gold-ink"
                    strokeWidth={1.5}
                  />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-medium">{title}</h3>
                  <p className="mt-1.5 text-sm text-pretty text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-lg shadow-card">
          <Image
            src={feature.src}
            alt={feature.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </Section>
  );
}

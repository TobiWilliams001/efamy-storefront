import { Flame, Leaf, Truck, Utensils } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/section";

const reasons = [
  {
    icon: Flame,
    title: "Mild or hot, your choice",
    description:
      "Our chilli sauces come in two strengths, so everyone at the table gets the heat they want.",
  },
  {
    icon: Leaf,
    title: "No artificial preservatives",
    description:
      "Straightforward ingredients — onions, chillies, garlic and spice. Nothing artificial added.",
  },
  {
    icon: Utensils,
    title: "Made for real cooking",
    description:
      "Sauces, seasoning mixes and coatings built for everyday meals, not just the cupboard.",
  },
  {
    icon: Truck,
    title: "Made in the UK",
    description:
      "Produced here and shipped from here, so your order arrives quickly.",
  },
];

export function WhyEfamy() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Why Efamy"
        title="Flavour worth the wait"
        description="We make the sauces we grew up with, to the standard they deserve."
      />
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, title, description }) => (
          <li key={title}>
            <Icon
              aria-hidden="true"
              className="size-6 text-gold-ink"
              strokeWidth={1.5}
            />
            <h3 className="mt-4 font-heading text-lg font-medium">{title}</h3>
            <p className="mt-2 text-sm text-pretty text-muted-foreground">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

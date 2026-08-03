import { Flame, Leaf, Truck, Utensils } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/section";

const reasons = [
  {
    icon: Flame,
    title: "Small batch, slow cooked",
    description:
      "Every jar is cooked in small runs so the flavour develops properly. Nothing is rushed.",
  },
  {
    icon: Leaf,
    title: "Real ingredients",
    description:
      "Scotch bonnet, ginger, dried shrimp and whole spices. No fillers, no artificial colour.",
  },
  {
    icon: Utensils,
    title: "Recipes from home",
    description:
      "Built on Ghanaian family recipes, adjusted only enough to make them repeatable.",
  },
  {
    icon: Truck,
    title: "UK made and shipped",
    description:
      "Produced in the UK and sent out from here, so orders arrive quickly and fresh.",
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
              className="size-6 text-primary"
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

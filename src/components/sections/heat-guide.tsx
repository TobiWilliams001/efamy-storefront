import Link from "next/link";

import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { buildQuery } from "@/lib/product-filters";
import { routes } from "@/lib/routes";

const levels = [
  {
    heat: "mild" as const,
    title: "Mild",
    description:
      "Warmth rather than burn. The same recipe as our hot jars, with less chilli, so it suits a table where tastes differ and works for children and anyone new to Ghanaian food.",
    examples: "Beans, Beef and Fish",
  },
  {
    heat: "hot" as const,
    title: "Hot",
    description:
      "A proper, lingering heat that stands up to rice, grilled meat and fried plantain. This is the one to reach for if you already cook with chilli and want the flavour to carry.",
    examples: "Beef, Chicken, Fish and Pork",
  },
];

export function HeatGuide() {
  return (
    <Section surface="muted">
      <SectionHeader
        eyebrow="Mild or hot"
        title="Which jar is for you?"
        description="Every sauce comes in one or both strengths. The difference is chilli, not recipe."
        align="center"
      />
      <ul className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {levels.map((level) => (
          <li
            key={level.heat}
            className="flex flex-col rounded-lg bg-card p-6 shadow-card sm:p-8"
          >
            <h3 className="font-heading text-2xl">{level.title}</h3>
            <p className="mt-3 flex-1 text-pretty text-muted-foreground">
              {level.description}
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              Available in {level.examples}.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-6 w-fit">
              <Link
                href={`${routes.shop}${buildQuery({}, { heat: level.heat })}`}
              >
                Shop {level.title.toLowerCase()}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

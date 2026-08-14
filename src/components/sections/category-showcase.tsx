import Link from "next/link";
import { ArrowRight, BookOpen, Sprout } from "lucide-react";

import { CategoryCard } from "@/components/commerce/category-card";
import { Section, SectionHeader } from "@/components/layout/section";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";

/**
 * A bento rather than a uniform row: the two halves of the range are not equal
 * in size or importance, and the grid says so. Chilli sauces take the large
 * cell because seven of the ten products live there.
 *
 * The layout only asserts itself from `lg` up. Below that every tile is a full
 * width card in reading order, which is what a phone wants.
 */

function LinkTile({
  href,
  title,
  description,
  icon: Icon,
  className,
  tone = "clay",
}: {
  href: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  className?: string;
  tone?: "clay" | "ink";
}) {
  const onInk = tone === "ink";

  return (
    <article
      className={cn(
        "group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-lg p-6 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-ring hover:shadow-card-hover sm:p-7",
        onInk ? "bg-ink text-ink-foreground" : "bg-clay/40",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn("size-6", onInk ? "text-gold" : "text-gold-ink")}
        strokeWidth={1.5}
      />

      <div>
        <h3 className="font-heading text-xl">
          <Link
            href={href}
            className="decoration-1 underline-offset-4 group-hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {title}
          </Link>
        </h3>
        <p
          className={cn(
            "mt-1.5 text-sm text-pretty",
            onInk ? "text-ink-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
        <ArrowRight
          aria-hidden="true"
          className="mt-4 size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      </div>
    </article>
  );
}

export function CategoryShowcase({
  categories,
}: {
  categories: ProductCategory[];
}) {
  if (categories.length === 0) return null;

  const [primary, ...rest] = categories;

  return (
    <Section surface="default">
      <SectionHeader
        eyebrow="Browse"
        title="Find your heat"
        description="Chilli sauces built around a protein, and the seasoning mixes that go with them."
      />

      <div className="grid gap-6 lg:auto-rows-[13rem] lg:grid-cols-4 lg:gap-8">
        <CategoryCard
          category={primary}
          className="aspect-4/3 lg:col-span-2 lg:row-span-2 lg:aspect-auto"
          sizes="(min-width: 1024px) 620px, 100vw"
        />

        {rest.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            className="aspect-4/3 lg:col-span-2 lg:aspect-auto"
            sizes="(min-width: 1024px) 620px, 100vw"
          />
        ))}

        <LinkTile
          href={routes.recipes}
          title="Recipes"
          description="The dishes these jars were made for."
          icon={BookOpen}
        />

        <LinkTile
          href={routes.about}
          title="Our story"
          description="Made in Corby since 2008."
          icon={Sprout}
          tone="ink"
        />
      </div>
    </Section>
  );
}

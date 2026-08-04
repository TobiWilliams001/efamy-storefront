import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CategoryCard } from "@/components/commerce/category-card";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import { CallToAction } from "@/components/sections/call-to-action";
import { WhyEfamy } from "@/components/sections/why-efamy";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/lib/catalogue";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.legalName} is a premium Ghanaian food brand, proudly made in the UK, bringing authentic flavours, trusted quality and traditional recipes.`,
  alternates: { canonical: routes.about },
};

export default async function AboutPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHeader
        tone="ink"
        eyebrow="About Efamy"
        title="A premium Ghanaian food brand, proudly made in the UK."
        description="Efamy brings authentic Ghanaian flavours, trusted quality and traditional recipes to modern kitchens. These are the jars that sit on the table at every meal, made here in Britain."
        breadcrumb={[{ name: "Home", href: routes.home }, { name: "About" }]}
      />

      <Container className="mt-14 lg:mt-20">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white shadow-card">
          <Image
            src="/products/collections/range-lineup.jpg"
            alt="The Efamy range of chilli sauces and seasoning mixes"
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-contain p-8 sm:p-14"
          />
        </div>
      </Container>

      <Section width="prose">
        <div className="grid gap-x-16 gap-y-10 sm:grid-cols-[10rem_1fr]">
          <h2 className="text-2xl sm:text-xl">What we make</h2>
          <div>
            <p className="text-lg text-pretty text-muted-foreground">
              Our range starts with chilli sauces built around a protein: beans,
              beef, chicken, fish and pork. Alongside them sit the seasoning
              mixes: an All Purpose blend for meat, fish and chicken, a Kelewele
              mix for spiced fried plantain, and Coat &amp; Cook for a crisp
              coating.
            </p>
            <p className="mt-5 text-pretty text-muted-foreground">
              The ingredient lists are short and readable, because that is how
              this food is cooked at home. Nothing artificial goes in.
            </p>
          </div>

          <h2 className="text-2xl sm:text-xl">Mild and hot</h2>
          <div>
            <p className="text-lg text-pretty text-muted-foreground">
              Heat is a preference, not a test. Where a sauce comes in two
              strengths the recipe underneath is the same. The mild version
              simply carries less chilli.
            </p>
            <p className="mt-5 text-pretty text-muted-foreground">
              It means a table with different tastes can share the same meal,
              which is rather the point.
            </p>
          </div>

          <h2 className="text-2xl sm:text-xl">Where to find us</h2>
          <div>
            <p className="text-lg text-pretty text-muted-foreground">
              You can order the full range directly from this site. We also
              supply retailers, so if you stock food and would like to carry
              Efamy, we would like to hear from you.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link href={routes.shop}>Explore Our Products</Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href={routes.stockists}>Stockists &amp; wholesale</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section surface="muted">
        <SectionHeader
          eyebrow="The range"
          title="Two ways to cook with Efamy"
        />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {categories.map((category) => (
            <li key={category.id} className="flex">
              <CategoryCard category={category} className="w-full" />
            </li>
          ))}
        </ul>
      </Section>

      <WhyEfamy />
      <CallToAction />
    </>
  );
}

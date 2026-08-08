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
  description: `${siteConfig.legalName} has been making Ghanaian chilli sauces and seasonings in Kettering since 2008. Real meat, poultry, beans and fish. No colours, additives or preservatives.`,
  alternates: { canonical: routes.about },
};

export default async function AboutPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHeader
        tone="ink"
        eyebrow="About Efamy"
        title="It began with one batch, at the end of 2008."
        description="Ghanaian chilli sauces and seasonings, made in Kettering ever since. The same recipes, the same short ingredient lists, and no shortcuts we would not take at home."
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
          <h2 className="text-2xl sm:text-xl">How it started</h2>
          <div>
            <p className="text-lg text-pretty text-muted-foreground">
              On 30 December 2008 we made our first batch of chilli sauce and
              sold it to friends and family. They came back for more, which was
              all the encouragement we needed.
            </p>
            <p className="mt-5 text-pretty text-muted-foreground">
              The seasonings came from the same place. Customers kept asking for
              the blend we cooked with, so two years later we jarred it as the
              All Purpose Seasoning Mix. Coat &amp; Cook followed, and in
              December 2015 came the first Kelewele Seasoning.
            </p>
            <p className="mt-5 text-pretty text-muted-foreground">
              Everything is still made to those recipes. We keep looking for
              ways to make them better, and none of them involve making them
              cheaper.
            </p>
          </div>

          <h2 className="text-2xl sm:text-xl">Our chilli sauces</h2>
          <div>
            <p className="text-lg text-pretty text-muted-foreground">
              Seven flavours made from real meat, poultry, beans and fish. Fresh
              ginger, garlic and onions are our main ingredients, and our oils
              are mainly vegetable oil and extra virgin olive oil.
            </p>
            <p className="mt-5 text-pretty text-muted-foreground">
              No colours, additives or preservatives. Spoon them over rice,
              chips, pasta or couscous, stir them through a salad, or take a jar
              to a barbecue and watch it disappear.
            </p>
          </div>

          <h2 className="text-2xl sm:text-xl">Our seasonings</h2>
          <div>
            <p className="text-lg text-pretty text-muted-foreground">
              Made mainly from natural ingredients including ginger and garlic
              powder, spices and chilli peppers.
            </p>
            <p className="mt-5 text-pretty text-muted-foreground">
              An All Purpose blend for meat, fish and chicken, a Kelewele mix
              for spiced fried plantain, and Coat &amp; Cook for a crisp
              coating.
            </p>
          </div>

          <h2 className="text-2xl sm:text-xl">On heat</h2>
          <div>
            <p className="text-lg text-pretty text-muted-foreground">
              Heat is a preference, not a test. Where a sauce comes in more than
              one strength the recipe underneath is the same, so choosing the
              gentler jar never means settling for less flavour.
            </p>
            <p className="mt-5 text-pretty text-muted-foreground">
              It means a table with different tastes can share the same meal,
              which is rather the point.
            </p>
          </div>

          <h2 className="text-2xl sm:text-xl">Where to find us</h2>
          <div>
            <p className="text-lg text-pretty text-muted-foreground">
              Order the full range directly from this site, or find us on the
              shelves of independent grocers across the Midlands, Essex,
              Berkshire and Buckinghamshire. If you run a shop and would like to
              carry Efamy, we would like to hear from you.
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

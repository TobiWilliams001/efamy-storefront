import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Prose } from "@/components/common/prose";
import { Section, SectionHeader } from "@/components/layout/section";
import { CallToAction } from "@/components/sections/call-to-action";
import { TrustBar } from "@/components/sections/trust-bar";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.legalName} makes Ghanaian chilli sauces and seasoning mixes in the UK — beans, beef, chicken, fish and pork, in mild and hot.`,
  alternates: { canonical: routes.about },
};

export default function AboutPage() {
  return (
    <>
      <Section spacing="sm">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              as="h1"
              eyebrow="About"
              title="Ghanaian flavour, made in Britain"
              description="Efamy makes the chilli sauces and seasonings of Ghanaian home cooking, produced here in the UK."
              className="mb-0"
            />
          </div>
          <div className="relative aspect-5/4 w-full">
            <Image
              src="/products/collections/range-lineup.jpg"
              alt="The Efamy range of chilli sauces and seasoning mixes"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              preload
              className="rounded-lg object-contain"
            />
          </div>
        </div>
      </Section>

      <TrustBar />

      <Section width="prose">
        <Prose>
          <h2>What we make</h2>
          <p>
            Our range starts with chilli sauces built around a protein — beans,
            beef, chicken, fish and pork — each offered mild or hot so a table
            with different tastes can share the same meal. Alongside them sit
            our seasoning mixes: an All Purpose blend for meat, fish and
            chicken, a Kelewele mix for spiced fried plantain, and Coat &amp;
            Cook for a crisp coating.
          </p>
          <p>
            Every jar is made without artificial preservatives. The ingredient
            lists are short and readable, because that is how this food is
            cooked at home.
          </p>

          <h2>Mild and hot</h2>
          <p>
            Heat is a preference, not a test. Where a sauce comes in two
            strengths, the recipe underneath is the same — the mild version
            simply carries less chilli. You are not trading away flavour by
            choosing it.
          </p>

          <h2>Where to find us</h2>
          <p>
            You can order the full range directly from this site. We also supply
            retailers — if you stock food and would like to carry Efamy, we
            would like to hear from you.
          </p>
        </Prose>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="xl" variant="accent">
            <Link href={routes.shop}>Shop the range</Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href={routes.stockists}>Stockists &amp; wholesale</Link>
          </Button>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { FaqList } from "@/components/common/faq-list";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { faqs } from "@/lib/faqs";
import { routes } from "@/lib/routes";
import { faqSchema, serialiseJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: `Common questions about ${siteConfig.name} chilli sauces and seasonings: heat levels, ingredients, allergens, storage and wholesale.`,
  alternates: { canonical: routes.faq },
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialiseJsonLd(faqSchema(faqs)) }}
      />

      <PageHeader
        eyebrow="Help"
        title="Frequently asked questions"
        description="Heat levels, ingredients, delivery and stocking Efamy in your shop."
      />

      <Section spacing="afterHeader" width="prose">
        <FaqList faqs={faqs} />

        <div className="mt-12 rounded-lg bg-clay/40 p-8">
          <h2 className="font-heading text-xl">Still have a question?</h2>
          <p className="mt-2 text-pretty text-muted-foreground">
            If your question is not answered here, send us a message and we will
            come back to you.
          </p>
          <Button asChild size="xl" className="mt-6">
            <Link href={routes.contact}>Send us a message</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}

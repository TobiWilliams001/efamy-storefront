import type { Metadata } from "next";
import Link from "next/link";
import { Store } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Prose } from "@/components/common/prose";
import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { stockists } from "@/lib/stockists";

export const metadata: Metadata = {
  title: "Stockists",
  description: `Find ${siteConfig.name} chilli sauces and seasonings in store, or enquire about stocking us.`,
  alternates: { canonical: routes.stockists },
};

export default function StockistsPage() {
  return (
    <Section>
      <SectionHeader
        as="h1"
        eyebrow="Stockists"
        title="Where to buy"
        description="Order online from us directly, or find Efamy on the shelf near you."
      />

      {stockists.length === 0 ? (
        <EmptyState
          icon={Store}
          title="Our stockist list is on its way"
          description="We are confirming which shops to list. In the meantime you can order the full range directly from us."
          action={
            <Button asChild size="xl" variant="accent">
              <Link href={routes.shop}>Shop online</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stockists.map((stockist) => (
            <li
              key={stockist.id}
              className="rounded-lg bg-card p-6 shadow-card"
            >
              <h2 className="font-heading text-lg">{stockist.name}</h2>
              <address className="mt-2 text-sm text-muted-foreground not-italic">
                {stockist.address}
                <br />
                {stockist.city} {stockist.postcode}
              </address>
              {stockist.url ? (
                <a
                  href={stockist.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-block text-sm underline underline-offset-4"
                >
                  Visit website
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-16 max-w-2xl">
        <Prose>
          <h2>Stock Efamy in your shop</h2>
          <p>
            We supply independent retailers, grocers and food shops across the
            UK. If you would like to carry the range, get in touch and we will
            send you trade pricing and case quantities.
          </p>
        </Prose>
        <Button asChild size="xl" className="mt-6">
          <Link href={routes.contact}>Enquire about wholesale</Link>
        </Button>
      </div>
    </Section>
  );
}

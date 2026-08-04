import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ShoppingBag, Store, Truck } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { stockists } from "@/lib/stockists";

export const metadata: Metadata = {
  title: "Stockists & Wholesale",
  description: `Buy ${siteConfig.name} chilli sauces and seasonings online, or enquire about stocking us in your shop.`,
  alternates: { canonical: routes.stockists },
};

const wholesalePoints = [
  {
    icon: Store,
    title: "Independents welcome",
    description:
      "We supply grocers, delis and food shops of every size. There is no minimum shelf space.",
  },
  {
    icon: Truck,
    title: "Case quantities",
    description:
      "Sauces and seasonings ship in mixed or single-line cases, whichever suits your shelf.",
  },
  {
    icon: MapPin,
    title: "UK-wide",
    description:
      "Produced and dispatched in the UK, so lead times stay short and predictable.",
  },
];

export default function StockistsPage() {
  return (
    <>
      <Section>
        <SectionHeader
          as="h1"
          eyebrow="Stockists & wholesale"
          title="Where to buy Efamy"
          description="Right now the surest way to get the full range is to order direct. We are also building our list of retail stockists."
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col rounded-lg bg-card p-8 shadow-card sm:p-10">
            <ShoppingBag
              aria-hidden="true"
              className="size-6 text-gold-ink"
              strokeWidth={1.75}
            />
            <h2 className="mt-5 font-heading text-2xl">Buy online</h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Every sauce and seasoning we make, delivered across the UK.
              Ordering direct is the surest way to get the full range.
            </p>
            <div className="mt-8">
              <Button asChild size="xl" variant="accent">
                <Link href={routes.shop}>Shop the range</Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col rounded-lg border border-dashed border-neutral-300 p-8 sm:p-10">
            <Store
              aria-hidden="true"
              className="size-6 text-muted-foreground"
              strokeWidth={1.75}
            />
            <h2 className="mt-5 font-heading text-2xl">Find us in store</h2>

            {stockists.length === 0 ? (
              <>
                <p className="mt-3 text-pretty text-muted-foreground">
                  We are confirming which shops to list here, so this page is
                  the place for wholesale enquiries for now. If you have seen
                  Efamy on a shelf near you, tell us and we will add them.
                </p>
                <div className="mt-8">
                  <Button asChild size="xl" variant="outline">
                    <Link href={routes.contact}>Tell us where you shop</Link>
                  </Button>
                </div>
              </>
            ) : (
              <ul className="mt-6 space-y-6">
                {stockists.map((stockist) => (
                  <li key={stockist.id}>
                    <h3 className="font-medium">{stockist.name}</h3>
                    <address className="mt-1 text-sm text-muted-foreground not-italic">
                      {stockist.address}, {stockist.city} {stockist.postcode}
                    </address>
                    {stockist.url ? (
                      <a
                        href={stockist.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-1 inline-block text-sm underline underline-offset-4"
                      >
                        Visit website
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      <Section surface="muted">
        <SectionHeader
          eyebrow="Wholesale"
          title="Stock Efamy in your shop"
          description="If you sell food and would like to carry the range, we will send you trade pricing and case quantities."
          action={
            <Button asChild size="xl">
              <Link href={routes.contact}>Enquire about wholesale</Link>
            </Button>
          }
        />
        <ul className="grid gap-8 sm:grid-cols-3">
          {wholesalePoints.map(({ icon: Icon, title, description }) => (
            <li key={title}>
              <Icon
                aria-hidden="true"
                className="size-5 text-gold-ink"
                strokeWidth={1.75}
              />
              <h3 className="mt-4 font-heading text-lg">{title}</h3>
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

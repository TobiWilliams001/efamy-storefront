import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ShoppingBag, Store, Truck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { stockists, stockistsByRegion } from "@/lib/stockists";

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
      <PageHeader
        tone="ink"
        eyebrow="Stockists & wholesale"
        title="Where to buy Efamy"
        description="Order the full range direct, or pick up a jar from one of the independent grocers who have carried Efamy for years."
      />
      <Section spacing="afterHeader">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:items-start lg:gap-8">
          <div className="rounded-lg bg-card p-8 shadow-card sm:p-10">
            <ShoppingBag
              aria-hidden="true"
              className="size-6 text-gold-ink"
              strokeWidth={1.75}
            />
            <h2 className="mt-5 font-heading text-2xl">Buy online</h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Every sauce and seasoning we make, delivered across the UK. Shops
              carry a selection; ordering direct is the only way to get all of
              it.
            </p>
            <div className="mt-8">
              <Button asChild size="xl" variant="accent">
                <Link href={routes.shop}>Shop the range</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 p-8 sm:p-10">
            <Store
              aria-hidden="true"
              className="size-6 text-muted-foreground"
              strokeWidth={1.75}
            />
            <h2 className="mt-5 font-heading text-2xl">Find us in store</h2>
            {stockists.length > 0 ? (
              <p className="mt-3 text-pretty text-muted-foreground">
                Independent grocers who stock Efamy products. Stock varies from
                shop to shop, so it is worth ringing ahead for a particular jar.
              </p>
            ) : null}

            {stockists.length === 0 ? (
              <>
                <p className="mt-3 text-pretty text-muted-foreground">
                  We are confirming which shops to list here, so this page is
                  the place for wholesale enquiries for now.
                </p>
                <div className="mt-8">
                  <Button asChild size="xl" variant="outline">
                    <Link href={routes.contact}>Tell us where you shop</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-6 space-y-8">
                {stockistsByRegion().map(({ region, shops }) => (
                  <div key={region}>
                    <h3 className="text-xs font-medium tracking-[0.18em] text-gold-ink uppercase">
                      {region}
                    </h3>
                    <ul className="mt-3 grid gap-4 sm:grid-cols-2">
                      {shops.map((shop) => (
                        <li
                          key={shop.id}
                          className="rounded-lg border border-neutral-200 p-4"
                        >
                          <p className="font-medium">{shop.name}</p>
                          {shop.address || shop.city ? (
                            <address className="mt-1 text-sm text-muted-foreground not-italic">
                              {[shop.address, shop.city, shop.postcode]
                                .filter(Boolean)
                                .join(", ")}
                            </address>
                          ) : null}
                          {shop.phone ? (
                            <a
                              href={`tel:${shop.phone.replace(/\s/g, "")}`}
                              className="mt-2 inline-block text-sm underline underline-offset-4"
                            >
                              {shop.phone}
                            </a>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="text-sm text-pretty text-muted-foreground">
                  Seen Efamy somewhere that is not on this list?{" "}
                  <Link
                    href={routes.contact}
                    className="underline underline-offset-4"
                  >
                    Tell us
                  </Link>{" "}
                  and we will add them.
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section>
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

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Photograph second in the source so it reads after the points on a
              phone, and ordered right on desktop. */}
          <div className="relative aspect-video overflow-hidden rounded-lg shadow-card lg:order-2">
            <Image
              src="/photos/bottling-chilli-oil.jpg"
              alt="Bottles of Efamy chilli oil on a worktop, filled and capped"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <ul className="grid gap-8 sm:grid-cols-2 lg:order-1 lg:grid-cols-1">
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
        </div>
      </Section>
    </>
  );
}

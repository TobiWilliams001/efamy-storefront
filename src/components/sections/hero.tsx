import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <Image
        src="/products/hero/hero-hot-sauce-trio.jpg"
        alt="Efamy pork, beef and chicken chilli sauces on a wooden board with fresh chillies and garlic"
        fill
        sizes="100vw"
        preload
        className="-z-10 object-cover object-right"
      />

      {/*
       * The photograph already has an empty, well-lit left third. The scrim
       * only deepens it enough to hold text at narrow widths, where the jars
       * shift under the headline.
       */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-background via-background/85 to-background/10 sm:via-background/70 sm:to-transparent"
      />

      <Container>
        <div className="flex min-h-140 items-center py-20 lg:min-h-160">
          <div className="max-w-lg">
            <p className="flex items-center gap-3 text-xs font-medium tracking-[0.18em] text-neutral-700 uppercase">
              <span
                aria-hidden="true"
                className="h-px w-6 shrink-0 bg-neutral-400"
              />
              Made in the UK
            </p>
            <h1 className="mt-6 text-4xl text-balance sm:text-5xl lg:text-6xl">
              Authentic Ghanaian Flavours. Crafted in the UK.
            </h1>
            <p className="mt-6 max-w-md text-lg text-pretty text-neutral-700">
              Chilli sauces in beans, beef, chicken, fish and pork, mild or hot,
              alongside our seasoning mixes. No artificial preservatives.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link href={routes.shop}>Shop Now</Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href={routes.about}>Our story</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

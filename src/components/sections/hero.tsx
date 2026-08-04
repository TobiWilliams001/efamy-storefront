import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function Hero() {
  return (
    <section className="overflow-hidden bg-background">
      <Container className="py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Efamy Food Products
            </p>
            <h1 className="mt-5 text-4xl text-balance sm:text-5xl lg:text-6xl">
              Authentic Ghanaian Flavours. Crafted in the UK.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-pretty text-muted-foreground">
              Chilli sauces in beans, beef, chicken, fish and pork — mild or hot
              — alongside our seasoning mixes. No artificial preservatives.
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

          {/*
           * Capped at the source width (558px). The cut-out is small, so
           * letting it fill a 50vw column would upscale and soften it.
           */}
          <div className="mx-auto w-full max-w-136">
            <Image
              src="/products/transparent/range-lineup-cutout.png"
              alt="The Efamy range: all purpose seasoning mix with chicken, beef and fish chilli sauces"
              width={558}
              height={447}
              sizes="(min-width: 1024px) 544px, 100vw"
              preload
              className="h-auto w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

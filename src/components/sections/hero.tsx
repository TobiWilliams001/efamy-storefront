import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/*
       * A large soft clay field behind the product. The cut-out has no
       * background of its own, so without something to sit against it floats;
       * this grounds it and gives the page depth without adding clutter.
       */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-0 hidden aspect-square w-184 translate-x-1/4 -translate-y-1/2 rounded-full bg-clay/35 blur-[2px] lg:block"
      />

      <Container className="relative py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
          <div className="max-w-xl">
            <p className="flex items-center gap-3 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              <span
                aria-hidden="true"
                className="h-px w-6 shrink-0 bg-neutral-300"
              />
              Efamy Food Products
            </p>

            <h1 className="mt-6 text-[2.75rem] text-balance sm:text-6xl lg:text-7xl">
              Authentic Ghanaian Flavours.
              <span className="block text-brand">Crafted in the UK.</span>
            </h1>

            <p className="mt-7 max-w-md text-lg text-pretty text-muted-foreground">
              Traditional recipes and premium ingredients, made for everyday
              cooking. Chilli sauces in mild or hot, plus our seasoning mixes.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="xl" variant="accent">
                <Link href={routes.shop}>Shop Now</Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href={routes.shop}>Explore Products</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full bg-clay/35 lg:hidden"
            />
            <Image
              src="/products/transparent/range-lineup-cutout.png"
              alt="The Efamy range: all purpose seasoning mix with chicken, beef and fish chilli sauces"
              width={558}
              height={447}
              sizes="(min-width: 1024px) 620px, 90vw"
              preload
              className="h-auto w-full drop-shadow-[0_24px_40px_rgba(0,0,0,0.14)]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

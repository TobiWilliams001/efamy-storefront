import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[32rem] items-end overflow-hidden lg:min-h-[40rem]">
      <Image
        src="/images/placeholder/hero.png"
        alt="Efamy chilli sauces and seasonings arranged on a warm wooden surface"
        fill
        sizes="100vw"
        preload
        className="-z-10 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/45 to-black/20"
      />

      <Container className="py-16 lg:py-24">
        <div className="max-w-2xl text-white">
          <p className="text-xs font-medium tracking-[0.18em] uppercase">
            Made in the UK
          </p>
          <h1 className="mt-4 text-4xl text-balance sm:text-5xl lg:text-6xl">
            Authentic Ghanaian heat, made in small batches
          </h1>
          <p className="mt-6 max-w-xl text-lg text-pretty text-white/85">
            Slow-cooked chilli sauces, infused oils and hand-ground seasonings —
            built on scotch bonnet, dried shrimp and West African spice.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="xl">
              <Link href={routes.shop}>Shop the range</Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white hover:text-foreground"
            >
              <Link href={routes.about}>Our story</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

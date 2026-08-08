import Image from "next/image";
import Link from "next/link";
import { Flame, Leaf, MapPin, Sprout } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const signals = [
  { icon: Sprout, label: "Premium ingredients" },
  { icon: Leaf, label: "No artificial preservatives" },
  { icon: MapPin, label: "Made in the UK" },
  { icon: Flame, label: "Three strengths" },
];

export function Hero() {
  return (
    <section className="relative isolate -mt-16 overflow-hidden bg-ink lg:-mt-20">
      <Image
        src="/products/hero/hero-hot-sauce-trio.jpg"
        alt="Efamy pork, beef and chicken chilli sauces on a wooden board with fresh chillies and garlic"
        fill
        sizes="100vw"
        preload
        className="-z-10 object-cover object-right"
      />

      {/*
       * Two scrims, not one. The horizontal wash keeps the headline legible on
       * the left; the flat overlay darkens the photograph as a whole so the
       * jars read as lit rather than washed out.
       */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-ink via-ink/80 to-ink/10 sm:via-ink/65 lg:to-transparent"
      />
      {/* Lands the photograph on the section below rather than cutting it off. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-linear-to-b from-transparent to-background"
      />

      <Container>
        <div className="flex min-h-140 flex-col justify-center pt-36 pb-20 lg:min-h-165 lg:pt-44">
          <div className="max-w-xl">
            <h1 className="display-title text-4xl text-balance text-white sm:text-5xl lg:text-6xl">
              Bold flavour.
              <br />
              <span className="text-gold">Made with love.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-pretty text-white/80">
              Ghanaian chilli sauces and seasonings, made in the UK since 2008.
              Real meat, poultry, beans and fish — never a smooth paste.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link href={routes.shop}>Shop now</Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={routes.about}>Our story</Link>
              </Button>
            </div>
          </div>

          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-6 sm:gap-x-12">
            {signals.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex w-20 flex-col items-center gap-2 text-center sm:w-24"
              >
                <span className="flex size-11 items-center justify-center rounded-full border border-gold/50">
                  <Icon
                    aria-hidden="true"
                    className="size-5 text-gold"
                    strokeWidth={1.5}
                  />
                </span>
                <span className="text-xs text-balance text-white/75">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

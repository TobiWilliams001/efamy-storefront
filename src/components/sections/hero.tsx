import Image from "next/image";
import Link from "next/link";
import { Flame, Leaf, MapPin, Sprout } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const signals = [
  { icon: Sprout, label: "Premium ingredients" },
  { icon: Leaf, label: "No artificial preservatives" },
  { icon: MapPin, label: "Made in the UK" },
  { icon: Flame, label: "Three strengths" },
];

type HeroProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  /** Home only; inner pages open shorter so the content starts sooner. */
  size?: "full" | "compact";
  showSignals?: boolean;
  children?: React.ReactNode;
};

/**
 * The dark photographic opener. It carries a negative top margin so the
 * photograph runs up behind the transparent header — any route using this must
 * also be an overlay route in `site-header.tsx`, or the bar will sit solid on
 * top of it.
 */
export function Hero({
  title,
  description,
  size = "full",
  showSignals = false,
  children,
}: HeroProps) {
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

      <Container>
        <div
          className={cn(
            "flex flex-col justify-center pt-36 pb-20 lg:pt-44",
            size === "full"
              ? "min-h-140 lg:min-h-165"
              : "min-h-100 lg:min-h-120",
          )}
        >
          <div className="max-w-xl">
            <h1 className="display-title text-4xl text-balance text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-md text-lg text-pretty text-white/80">
              {description}
            </p>
            {children ? (
              <div className="mt-9 flex flex-wrap gap-3">{children}</div>
            ) : null}
          </div>

          {showSignals ? (
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
          ) : null}
        </div>
      </Container>
    </section>
  );
}

export function HomeHero() {
  return (
    <Hero
      showSignals
      title={
        <>
          Bold flavour.
          <br />
          <span className="text-gold">Made with love.</span>
        </>
      }
      description="Ghanaian chilli sauces and seasonings, made in the UK since 2008. Real meat, poultry, beans and fish — never a smooth paste."
    >
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
    </Hero>
  );
}

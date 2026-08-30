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
  /** Defaults to the home page photograph; pass one to give a page its own. */
  image?: string;
  imageAlt?: string;
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
  image = "/products/hero/hero-home.jpg",
  imageAlt = "The Efamy range",
  children,
}: HeroProps) {
  return (
    <section className="relative isolate -mt-16 overflow-hidden bg-ink lg:-mt-20">
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        preload
        className="-z-10 object-cover object-center sm:object-right"
      />

      {/*
       * Two scrims, not one. The flat one takes the whole photograph down a
       * touch; the horizontal wash does the real work behind the headline and
       * clears away to nothing on the right, so the photograph is left alone
       * where there is no text over it.
       */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/15" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-ink/75 via-ink/35 to-transparent sm:via-ink/25"
      />

      <Container>
        <div
          className={cn(
            "flex flex-col justify-center pt-28 pb-14 sm:pt-32 sm:pb-20 lg:pt-44",
            /*
             * Shorter on a phone. The photograph is landscape, so a tall box
             * makes object-cover scale it up and throw most of the width away;
             * bringing the height down keeps more of the picture in frame.
             */
            size === "full"
              ? "min-h-[26rem] sm:min-h-140 lg:min-h-165"
              : "min-h-[19rem] sm:min-h-100 lg:min-h-120",
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
            <ul className="mt-10 grid grid-cols-4 gap-x-2 gap-y-6 sm:mt-14 sm:flex sm:flex-wrap sm:gap-x-12">
              {signals.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex flex-col items-center gap-2 text-center sm:w-24"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-gold/50 sm:size-11">
                    <Icon
                      aria-hidden="true"
                      className="size-5 text-gold"
                      strokeWidth={1.5}
                    />
                  </span>
                  <span className="text-[0.6875rem] leading-tight text-balance text-white/75 sm:text-xs">
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
          Bold flavour, made with care.
          {/* A signature under the headline, not a second headline. Set in the
              body face, small and letterspaced: at this size a script turns
              into decoration you have to decipher. */}
          <span className="mt-5 block font-sans text-xs tracking-[0.22em] text-gold uppercase sm:mt-6 sm:text-sm">
            From our kitchen to yours.
          </span>
        </>
      }
      description="Ghanaian chilli sauces and seasonings, made in Corby since 2008. Real meat, poultry, beans and fish, never a smooth paste."
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

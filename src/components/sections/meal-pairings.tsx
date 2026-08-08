"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { dishes } from "@/lib/dishes";
import { cn } from "@/lib/utils";

export function MealPairings() {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [paused, setPaused] = useState(false);

  /*
   * Read from the scroll event rather than an effect, so the arrows reflect a
   * position the browser has already committed. Native scrolling stays in
   * charge: the arrows nudge it, they do not own it, which keeps swipe,
   * keyboard and trackpad working for free.
   */
  function onScroll() {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }

  function scrollBy(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  /*
   * Advances on its own, but stops the moment anyone touches it — hover, focus
   * or a manual scroll — and never starts at all under prefers-reduced-motion.
   * Autoplay that fights the person using it is worse than no autoplay.
   */
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      const el = track.current;
      if (!el) return;

      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if (end) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: el.clientWidth / 3, behavior: "smooth" });
    }, 3500);

    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section aria-labelledby="pairings-heading" className="bg-background py-16">
      <Container>
        <div className="text-center">
          <h2
            id="pairings-heading"
            className="display-title text-2xl text-brand sm:text-3xl lg:text-4xl"
          >
            Perfect with every meal
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-5 block h-0.5 w-14 rounded-full bg-gold"
          />
        </div>

        <div
          className="relative mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
        >
          <Arrow
            direction="left"
            disabled={atStart}
            onClick={() => scrollBy(-1)}
          />

          <ul
            ref={track}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 lg:gap-8"
          >
            {dishes.map((dish) => (
              <li
                key={dish.name}
                /* Six across on desktop; the fractional basis leaves the next
                   tile half-visible on small screens so the row reads as
                   scrollable without an arrow to say so. */
                className="flex w-[28%] shrink-0 snap-start flex-col items-center gap-3 sm:w-[22%] md:w-[16.6667%] lg:w-[calc((100%-5*2rem)/6)]"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-full ring-1 ring-neutral-200">
                  {dish.image ? (
                    <Image
                      src={dish.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 180px, 40vw"
                      className="object-cover"
                    />
                  ) : (
                    <ImagePlaceholder
                      compact
                      label={dish.name}
                      className="size-full"
                    />
                  )}
                </div>
                <p className="text-center text-sm font-medium text-balance">
                  {dish.name}
                </p>
              </li>
            ))}
          </ul>

          <Arrow
            direction="right"
            disabled={atEnd}
            onClick={() => scrollBy(1)}
          />
        </div>
      </Container>
    </section>
  );
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous meals" : "Next meals"}
      className={cn(
        "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-card text-brand shadow-card transition-opacity hover:bg-clay/30 focus-visible:ring-3 focus-visible:ring-brand/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-0 sm:flex",
        direction === "left" ? "-left-4 lg:-left-5" : "-right-4 lg:-right-5",
      )}
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  );
}

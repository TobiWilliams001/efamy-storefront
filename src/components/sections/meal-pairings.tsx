"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Rule } from "@/components/layout/rule";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { dishes } from "@/lib/dishes";
import { cn } from "@/lib/utils";

/** Pixels per second. Slow enough to read a label as it passes. */
const SPEED = 26;

export function MealPairings() {
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);

  /*
   * The list is rendered twice and the scroll position wraps at the halfway
   * mark, so the row never rewinds — it just keeps going. Rewinding to zero at
   * the end is what makes an auto-carousel feel mechanical.
   *
   * Driven by requestAnimationFrame rather than an interval, so the movement is
   * continuous instead of a lurch every few seconds, and so it stops on its own
   * when the tab is in the background.
   */
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = 0;

    function tick(now: number) {
      const el = track.current;
      if (!el) return;

      if (last) {
        el.scrollLeft += (SPEED * (now - last)) / 1000;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }

      last = now;
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused]);

  function nudge(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.5, behavior: "smooth" });
  }

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
          <Rule className="mx-auto mt-5" />
        </div>

        <div
          className="relative mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
        >
          <Arrow direction="left" onClick={() => nudge(-1)} />

          <ul
            ref={track}
            className="no-scrollbar flex gap-6 overflow-x-auto lg:gap-8"
          >
            {[0, 1].map((pass) =>
              dishes.map((dish) => (
                <li
                  key={`${pass}-${dish.name}`}
                  /* The second pass exists only so the loop has somewhere to
                     wrap to, so it is hidden from assistive tech. */
                  aria-hidden={pass === 1}
                  className="flex w-[28%] shrink-0 flex-col items-center gap-3 sm:w-[22%] md:w-[16.6667%] lg:w-[calc((100%-5*2rem)/6)]"
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
              )),
            )}
          </ul>

          <Arrow direction="right" onClick={() => nudge(1)} />
        </div>
      </Container>
    </section>
  );
}

function Arrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous meals" : "Next meals"}
      className={cn(
        "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-card text-brand shadow-card transition-colors hover:bg-clay/30 focus-visible:ring-3 focus-visible:ring-brand/40 focus-visible:outline-none sm:flex",
        direction === "left" ? "-left-4 lg:-left-5" : "-right-4 lg:-right-5",
      )}
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  );
}

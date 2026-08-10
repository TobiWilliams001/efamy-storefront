import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Rule } from "@/components/layout/rule";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { dishes } from "@/lib/dishes";

/**
 * A continuously drifting ribbon of the meals these jars belong to.
 *
 * Deliberately not a scrolling container. A full-width horizontal scroller
 * competes with vertical swipes on touch — and when its position is also being
 * rewritten every frame, the page can feel like it will not scroll at all. A
 * transform inside `overflow-hidden` cannot intercept a gesture, so vertical
 * scrolling is never in question.
 *
 * That also makes this a server component with no JavaScript: the movement,
 * the hover pause and the reduced-motion opt-out are all CSS.
 */
export function MealPairings() {
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
      </Container>

      {/* Full bleed, so the ribbon runs off both edges rather than stopping. */}
      <div className="group mt-10 overflow-hidden">
        <ul className="flex w-max marquee-track gap-6 group-hover:[animation-play-state:paused] lg:gap-8">
          {[0, 1].map((pass) =>
            dishes.map((dish) => (
              <li
                key={`${pass}-${dish.name}`}
                /* The second pass only exists so the loop has somewhere to wrap
                   to, so it is hidden from assistive tech. */
                aria-hidden={pass === 1}
                className="flex w-24 shrink-0 flex-col items-center gap-3 lg:w-32"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-full ring-1 ring-neutral-200">
                  {dish.image ? (
                    <Image
                      src={dish.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 128px, 96px"
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
      </div>
    </section>
  );
}

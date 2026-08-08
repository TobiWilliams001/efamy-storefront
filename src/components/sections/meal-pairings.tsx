import Image from "next/image";

import { Container } from "@/components/layout/container";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { dishes } from "@/lib/dishes";

export function MealPairings() {
  return (
    <section aria-labelledby="pairings-heading" className="bg-background py-14">
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

        {/*
         * Horizontal scroll on small screens rather than a carousel: no
         * JavaScript, and the native scrollbar tells people there is more.
         */}
        <ul className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 sm:justify-center sm:gap-8 sm:overflow-visible lg:gap-10">
          {dishes.map((dish) => (
            <li
              key={dish.name}
              className="flex w-24 shrink-0 snap-start flex-col items-center gap-3 sm:w-auto"
            >
              <div className="relative size-24 overflow-hidden rounded-full ring-1 ring-neutral-200 lg:size-28">
                {dish.image ? (
                  <Image
                    src={dish.image}
                    alt=""
                    fill
                    sizes="112px"
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
      </Container>
    </section>
  );
}

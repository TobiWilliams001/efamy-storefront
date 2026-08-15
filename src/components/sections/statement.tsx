import Image from "next/image";
import Link from "next/link";

import { Rule } from "@/components/layout/rule";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const feature = {
  src: "/products/hero/hero-hot-sauce-trio.jpg",
  alt: "Efamy pork, beef and chicken chilli sauces on a wooden board with fresh chillies and garlic",
};

export function Statement() {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="grid lg:grid-cols-2">
        <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="ml-auto max-w-lg lg:mr-10">
            <h2 className="display-title text-2xl text-white sm:text-3xl lg:text-4xl">
              About Efamy
            </h2>
            <Rule className="mt-5 justify-start" />
            <p className="mt-7 text-lg text-pretty text-ink-muted">
              Good food is what brings everyone to the table. We have been
              making ours in Corby since 2008. Ghanaian chilli sauces and
              seasonings, to the recipes we grew up with.
            </p>
            <p className="mt-5 text-pretty text-ink-muted">
              Fresh ginger, garlic and onions are our main ingredients. No
              colours, additives or preservatives added.
            </p>
            <p className="mt-7 font-heading text-xl text-gold">
              Pure quality, pure taste, pure satisfaction.
            </p>
            <div className="mt-8">
              <Button asChild size="xl" variant="gold">
                <Link href={routes.about}>Read our story</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative min-h-72 lg:min-h-full">
          {/* Feathers the seam where the photograph meets the maroon. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-linear-to-b from-ink via-transparent to-transparent lg:bg-linear-to-r"
          />
          <Image
            src={feature.src}
            alt={feature.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

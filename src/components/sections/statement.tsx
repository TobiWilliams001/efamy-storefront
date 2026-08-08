import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { routes } from "@/lib/routes";

/** Set once we have the shot; the placeholder keeps the band whole until then. */
const feature = { src: undefined, alt: "" };

export function Statement() {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="grid lg:grid-cols-2">
        <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="ml-auto max-w-lg lg:mr-10">
            <h2 className="display-title text-2xl text-white sm:text-3xl lg:text-4xl">
              About Efamy
            </h2>
            <span
              aria-hidden="true"
              className="mt-5 block h-0.5 w-14 rounded-full bg-gold"
            />
            <p className="mt-7 text-lg text-pretty text-ink-muted">
              Good food is what brings everyone to the table. We have been
              making ours in Kettering since 2008 — Ghanaian chilli sauces and
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
              <Button asChild size="xl" variant="accent">
                <Link href={routes.about}>Learn more</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative min-h-72 lg:min-h-full">
          {feature.src ? (
            <Image
              src={feature.src}
              alt={feature.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder
              tone="dark"
              label="Chillies, garlic, onions and tomatoes around an open bowl of Efamy sauce, shot from above"
              className="absolute inset-0"
            />
          )}
        </div>
      </div>
    </section>
  );
}

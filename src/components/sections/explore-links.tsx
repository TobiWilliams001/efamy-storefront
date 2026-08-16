import Link from "next/link";
import { ArrowRight, BookOpen, Sprout } from "lucide-react";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

function LinkTile({
  href,
  title,
  description,
  icon: Icon,
  tone = "clay",
}: {
  href: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  tone?: "clay" | "ink";
}) {
  const onInk = tone === "ink";

  return (
    <article
      className={cn(
        "group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-lg p-6 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-ring hover:shadow-card-hover sm:p-7",
        onInk ? "bg-ink text-ink-foreground" : "bg-clay/40",
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn("size-6", onInk ? "text-gold" : "text-gold-ink")}
        strokeWidth={1.5}
      />

      <div>
        <h3 className="font-heading text-xl">
          <Link
            href={href}
            className="decoration-1 underline-offset-4 group-hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {title}
          </Link>
        </h3>
        <p
          className={cn(
            "mt-1.5 text-sm text-pretty",
            onInk ? "text-ink-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
        <ArrowRight
          aria-hidden="true"
          className="mt-4 size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      </div>
    </article>
  );
}

/** The two ways off a product row that are not another product. */
export function ExploreLinks() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:gap-8">
      <LinkTile
        href={routes.recipes}
        title="Recipes"
        description="The dishes these jars were made for."
        icon={BookOpen}
      />
      <LinkTile
        href={routes.about}
        title="Our story"
        description="Made in Corby since 2008."
        icon={Sprout}
        tone="ink"
      />
    </div>
  );
}

import Link from "next/link";

import { Rule } from "@/components/layout/rule";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/config/site";

/*
 * Someone here followed a link that no longer works, so the page owes them a
 * way on rather than an apology. The three routes are the three things they
 * were plausibly after: a jar, a dish to cook, or a person to ask.
 *
 * Static on purpose. A 404 is where a stale Google result and a mistyped
 * address land, and it should not depend on the catalogue loading.
 */
const ways = [
  {
    href: routes.shop,
    title: "The shop",
    description: "Every sauce, oil and seasoning we make.",
  },
  {
    href: routes.recipes,
    title: "Recipes",
    description: "The dishes these jars were made for.",
  },
  {
    href: routes.contact,
    title: "Ask us",
    description: "Tell us what you were looking for and we will find it.",
  },
];

export default function NotFound() {
  return (
    <Section width="narrow" spacing="lg">
      <div className="text-center">
        <p
          data-numeric
          className="display-title text-6xl text-gold sm:text-7xl"
          aria-hidden="true"
        >
          404
        </p>

        <h1 className="mt-4 display-title text-2xl text-brand sm:text-3xl">
          That page has moved on
        </h1>
        <Rule className="mt-5" />

        <p className="mx-auto mt-6 max-w-md text-pretty text-muted-foreground">
          The link may be out of date, or a jar may have sold out and come off
          the shop. Nothing is lost, and everything we make is still here.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {ways.map((way) => (
          <li key={way.href}>
            <Link
              href={way.href}
              className="group flex h-full flex-col rounded-lg border border-neutral-200 p-6 transition-colors hover:border-gold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="font-heading text-lg group-hover:text-brand">
                {way.title}
              </span>
              <span className="mt-2 text-sm text-pretty text-muted-foreground">
                {way.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <Button asChild size="xl" variant="accent">
          <Link href={routes.home}>Back to the start</Link>
        </Button>
        <p className="mt-6 text-sm text-muted-foreground">
          Certain there should be something here?{" "}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="underline underline-offset-4"
          >
            Tell us
          </a>{" "}
          and we will put it right.
        </p>
      </div>
    </Section>
  );
}

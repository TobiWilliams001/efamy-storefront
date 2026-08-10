import { Quote } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/section";
import { exampleTestimonials, testimonials } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

/**
 * Customer quotes.
 *
 * Falls back to the example set while no real quotes exist, and tags every one
 * of them "Example" so the design can be reviewed without anything reading as
 * social proof Efamy has not earned. The moment `testimonials` has entries the
 * examples disappear on their own.
 */
export function Testimonials({
  title = "What people say",
  description = "Fifteen years of customers, in their own words.",
}: {
  title?: string;
  description?: string;
}) {
  const real = testimonials.slice(0, 3);
  const showing = real.length > 0 ? real : exampleTestimonials.slice(0, 3);
  const isExample = real.length === 0;

  if (showing.length === 0) return null;

  return (
    <Section surface="muted">
      <SectionHeader align="center" title={title} description={description} />

      <ul className="grid gap-6 sm:grid-cols-3 lg:gap-8">
        {showing.map((entry) => (
          <li
            key={entry.name + entry.quote.slice(0, 20)}
            className={cn(
              "relative flex flex-col rounded-lg bg-card p-7 shadow-card sm:p-8",
              isExample && "border border-dashed border-gold/60",
            )}
          >
            {isExample ? (
              <span className="absolute top-4 right-4 rounded-full bg-gold/15 px-2 py-0.5 text-[0.625rem] font-semibold tracking-[0.1em] text-gold-ink uppercase">
                Example
              </span>
            ) : null}

            <Quote
              aria-hidden="true"
              className="size-6 shrink-0 text-gold"
              strokeWidth={1.5}
            />

            <blockquote className="mt-5 flex-1 text-pretty">
              {entry.quote}
            </blockquote>

            <p className="mt-6 text-sm font-medium">
              {entry.name}
              {entry.location ? (
                <span className="text-muted-foreground">
                  {" "}
                  · {entry.location}
                </span>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

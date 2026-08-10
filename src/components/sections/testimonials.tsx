import { Quote } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/section";
import { testimonials } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

/**
 * Where customer quotes go once Efamy has collected them.
 *
 * Until then this shows the finished layout filled with visible placeholders,
 * so the shape is agreed and it is obvious what is still owed. The placeholders
 * are deliberately not written as quotes — an invented testimonial that ships
 * by accident is worse than an empty section.
 */
export function Testimonials({
  title = "What people say",
  description = "Fifteen years of customers, in their own words.",
}: {
  title?: string;
  description?: string;
}) {
  const showing = testimonials.slice(0, 3);
  const slots = showing.length > 0 ? showing.length : 3;

  return (
    <Section surface="muted">
      <SectionHeader align="center" title={title} description={description} />

      <ul className="grid gap-6 sm:grid-cols-3 lg:gap-8">
        {Array.from({ length: slots }, (_, index) => {
          const entry = showing[index];

          return (
            <li
              key={entry?.name ?? `placeholder-${index}`}
              className={cn(
                "flex flex-col rounded-lg p-7 sm:p-8",
                entry
                  ? "bg-card shadow-card"
                  : "border border-dashed border-gold/50 bg-transparent",
              )}
            >
              <Quote
                aria-hidden="true"
                className={cn(
                  "size-6 shrink-0",
                  entry ? "text-gold" : "text-gold/60",
                )}
                strokeWidth={1.5}
              />

              {entry ? (
                <>
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
                </>
              ) : (
                <p className="mt-5 flex-1 text-sm text-pretty text-gold-ink">
                  Customer quote — waiting on a real one. Needs the
                  customer&apos;s own words, a first name and a town.
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

import { Section, SectionHeader } from "@/components/layout/section";
import {
  exampleTestimonials,
  showExampleTestimonials,
  testimonials,
} from "@/lib/testimonials";

/**
 * Customer quotes.
 *
 * Falls back to the placeholder set while no real quotes exist, and only where
 * `showExampleTestimonials` allows it — a production build renders nothing
 * rather than anything invented. Adding entries to `testimonials` takes over
 * automatically.
 */
export function Testimonials({
  title = "What people say",
  description = "Fifteen years of customers, in their own words.",
}: {
  title?: string;
  description?: string;
}) {
  const real = testimonials.slice(0, 3);
  const showing =
    real.length > 0
      ? real
      : showExampleTestimonials()
        ? exampleTestimonials.slice(0, 3)
        : [];

  if (showing.length === 0) return null;

  return (
    <Section surface="muted">
      <SectionHeader align="center" title={title} description={description} />

      <ul className="grid gap-6 sm:grid-cols-3 lg:gap-8">
        {showing.map((entry) => (
          <li
            key={entry.name + entry.quote.slice(0, 24)}
            className="relative flex flex-col overflow-hidden rounded-lg bg-card px-7 pt-12 pb-8 shadow-card sm:px-8"
          >
            {/*
             * A typographic quote mark rather than an icon: it sits behind the
             * text as a piece of the layout, which reads as editorial instead
             * of decorated.
             */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 left-5 font-heading text-[7rem] leading-none text-gold/20 select-none"
            >
              &ldquo;
            </span>

            <blockquote className="relative flex-1 font-heading text-lg leading-relaxed text-pretty">
              {entry.quote}
            </blockquote>

            <div className="mt-7 flex items-center gap-3 border-t border-neutral-200/80 pt-5">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 font-heading text-base text-gold-ink"
              >
                {entry.name.charAt(0)}
              </span>
              <p className="text-sm leading-tight">
                <span className="font-medium">{entry.name}</span>
                {entry.location ? (
                  <>
                    <br />
                    <span className="text-muted-foreground">
                      {entry.location}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

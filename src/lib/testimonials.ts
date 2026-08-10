export type Testimonial = {
  /** The customer's own words. Never written for them. */
  quote: string;
  name: string;
  /** Town or city. Grounds the quote in a real place. */
  location?: string;
  /** Slug of the product this is about, if it is about one. */
  productSlug?: string;
};

/**
 * Real customer quotes only.
 *
 * Empty on purpose. Efamy has traded since 2008 and has never collected a
 * review, so there is nothing true to show yet. Until this array has entries,
 * every review slot on the site renders a visible placeholder rather than
 * anything a visitor could mistake for social proof.
 *
 * When these arrive they need: the words, a first name, and ideally a town.
 * Nothing invented, nothing tidied into marketing copy — the plain phrasing is
 * what makes a quote read as real.
 *
 * Only once this is populated should Review or AggregateRating structured data
 * be added. Rating markup without real ratings behind it is exactly the kind of
 * thing Google issues manual penalties for.
 */
export const testimonials: Testimonial[] = [];

export function testimonialsFor(productSlug: string): Testimonial[] {
  return testimonials.filter((entry) => entry.productSlug === productSlug);
}

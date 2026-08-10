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

/**
 * Placeholder quotes, shown only while `testimonials` is empty and always
 * rendered with a visible "Example" tag.
 *
 * They exist so the section can be designed and shown to the client, not to
 * stand in for social proof. They are written from things that are actually
 * true of the products — the meat and fish chunks, the three strengths, kenkey
 * and barbecues — so the real quotes should sound like these rather than the
 * other way round.
 *
 * DELETE THIS ARRAY BEFORE LAUNCH. It is on the launch checklist in
 * docs/handover.md.
 */
export const exampleTestimonials: Testimonial[] = [
  {
    quote:
      "I grew up on this kind of sauce and had almost given up finding it here. You can actually see the fish in it. Took a jar to my mum and she asked where I got it.",
    name: "Ama",
    location: "Dagenham",
  },
  {
    quote:
      "Bought the mild for the children and the hot for me, same flavour underneath. That never happens. It has ended a long-running argument in this house.",
    name: "Michael",
    location: "Northampton",
  },
  {
    quote:
      "Took the beef one to a barbecue in August and came home with an empty jar and four people asking where to buy it. Ordering three more.",
    name: "Grace",
    location: "Milton Keynes",
  },
];

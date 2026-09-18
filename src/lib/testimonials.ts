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
 * Supplied by Efamy on 18 September 2026. Kept as the customers wrote them:
 * the grammar is theirs, and smoothing it into marketing copy is what would
 * make them stop reading as real. Two plain typing slips were corrected and
 * nothing else — "Tranformed" and a missing space in "haveever".
 *
 * No towns were supplied, so `location` is absent rather than guessed.
 *
 * Under the DMCC Act 2024 these must be genuine and the business must be able
 * to evidence that. They are published on Efamy's word that they are real.
 *
 * Still no Review or AggregateRating structured data: none of these carries a
 * star rating, and rating markup without real ratings behind it is what Google
 * issues manual penalties for.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "I love Efamy Kelewele seasoning mix. I use it for my khebabs and bbq. Great and unique product I have ever tried.",
    name: "Arnold Smith",
    productSlug: "kelewele-seasoning-mix",
  },
  {
    quote:
      "A remarkable product. Efamy All purpose has transformed my cooking. Unique taste and great flavour.",
    name: "Margaret Mckeon",
    productSlug: "all-purpose-seasoning-mix",
  },
  {
    quote:
      "I travel all the way to London to buy the wide variety of Efamy products especially the chilli sauces and oil. Transformed my cooking.",
    name: "Phillip Adjei",
  },
  {
    quote:
      "Since I discovered Efamy products, my family is now addicted to the full range of their products. Their chilli oils are superb.",
    name: "Anita Benson",
  },
  {
    quote:
      "It's always Efamy Beans chilli sauce until I tried their chilli oils. Changed my eating habit as their products are ready use, I spend less time cooking.",
    name: "Kelly Mensah",
    productSlug: "beans-chilli-sauce",
  },
  {
    quote:
      "As a student and vegetarian, I don't worry much with cooking as Efamy chilli sauces has made life easy by way of cooking. I simply add a spoonful or two to my noodles, rice or chips. Well done Efamy for transforming and adding new flavours to my food.",
    name: "Edward Kisenger",
  },
  {
    quote:
      "I always send a pack of six each of Efamy products to my mum in Scotland. Their online shopping have made it easier for my friends and family to easily buy them. Well done Efamy.",
    name: "Matilda Kinsley",
  },
  {
    quote:
      "Efamy products are simply the best. I have been using them since 2023. Great and tasty products.",
    name: "Alexander Pedro",
  },
];

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
 * These render in development, and on a deployed site only when
 * NEXT_PUBLIC_SHOW_EXAMPLE_REVIEWS is explicitly set to "true". A production
 * build with that flag unset shows nothing, so they cannot reach a customer by
 * being forgotten — publishing invented reviews has been illegal in the UK
 * since the DMCC Act 2024, so a checklist item alone is not enough of a guard.
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

/**
 * True when the placeholder quotes may be shown. Development always; anywhere
 * else only on an explicit opt-in.
 */
export function showExampleTestimonials(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_SHOW_EXAMPLE_REVIEWS === "true"
  );
}

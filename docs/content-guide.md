# Content guide

Where every piece of text and imagery lives, and the rules for writing it.

## Where content comes from

| Content                                            | Source                             | Who can change it         |
| -------------------------------------------------- | ---------------------------------- | ------------------------- |
| Products, prices, ingredients                      | Sanity                             | Anyone with Studio access |
| Categories                                         | Sanity                             | Anyone with Studio access |
| Brand name, tagline, contact details, social links | `src/config/site.ts`               | Developer                 |
| Navigation and footer links                        | `src/config/navigation.ts`         | Developer                 |
| Homepage section wording                           | `src/components/sections/`         | Developer                 |
| About, Stockists, Contact, legal pages             | `src/app/*/page.tsx`               | Developer                 |
| Frequently asked questions                         | `src/lib/faqs.ts`                  | Developer                 |
| Meal pairings row                                  | `src/lib/dishes.ts`                | Developer                 |
| Stockist list                                      | `src/lib/stockists.ts`             | Developer                 |
| Photography                                        | `public/` — see `public/ASSETS.md` | Developer                 |

Only products are self-service today. **Moving page copy into Sanity is the
single biggest thing that would reduce dependence on a developer**, and it is
not done.

## Voice

A premium British food brand making Ghanaian food. Warm, plain, confident.
Not folksy, not corporate, not shouty.

- British spelling: flavour, colour, personalise
- Say the thing. "Mild and hot" beats "a spectrum of heat experiences"
- Short sentences. Long ones read as marketing
- No exclamation marks. The food can be exciting; the copy needn't be
- Second person. "You", not "our customers"

## Claims that may not be invented

This is a food business, so some sentences carry legal weight.

**Never write these without confirming with the client:**

- Ingredients or allergens
- Nutrition figures
- "No artificial preservatives", "suitable for vegans", or similar
- Where a product is made
- Delivery times, costs, or a free-delivery threshold
- Anything about returns or refunds

If it is printed on the jar, it can go on the site. If it is not, ask. **A blank
field is always safer than a plausible guess.**

The legal pages are **drafts, marked as such on the page**. They follow the
shape UK law requires but have not been reviewed by anyone qualified. They must
be written properly before launch.

## Photography

Filenames and folders are documented in `public/ASSETS.md`.

**Product shots** — white background, roughly square, at least 1000px, JPEG.

**Dish photography** — square, cropped tight on the plate. Avoid strongly
coloured tablecloths: the site sits on warm ivory and a saturated backdrop
fights both the palette and the jars.

Two rules that are not negotiable:

1. **No AI-generated food.** Publishing invented images of food a customer will
   actually receive misrepresents the product. Fine for mockups, never live.
2. **Stock photography is context only.** A stock plate of jollof beside "goes
   well with jollof" is fine. A stock dish staged to imply it was cooked with an
   Efamy sauce is not.

Check licences allow commercial use.

## Alternative text

Every image needs it. Describe the product or dish, not the photograph.

- Good: `Jar of Efamy beef chilli sauce, hot, on a white background`
- Bad: `product image`, `IMG_4821`

Purely decorative images take an empty `alt`, which tells screen readers to skip
them.

## SEO

Each page sets its own title and description in a `metadata` export. Titles get
` | Efamy` appended automatically.

Descriptions: around 150 characters, honest about the page, written as a
sentence rather than a keyword list.

Product pages emit `Product` structured data with an `AggregateOffer` spanning
the size range. It is generated from the catalogue, so there is nothing to
maintain by hand.

## Currently placeholder

Written to be replaced. Not approved copy.

- Homepage section wording
- The About page narrative
- Product summaries and descriptions
- All three legal pages
- Serving suggestions

## Known gaps

- Contact details: phone, WhatsApp and social links are blank in
  `src/config/site.ts`, so those elements are hidden rather than broken
- No stockist list
- Net weights missing for several products
- No nutrition data anywhere
- Dish photography for six of the nine meal tiles
- **Recipes** — the largest content gap and the strongest SEO opportunity

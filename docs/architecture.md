# Architecture

How the storefront is put together and why.

## Shape

```
Sanity Studio  ──writes──▶  Sanity Content Lake
                                    │
                                    │ GROQ over HTTPS
                                    ▼
                          src/lib/catalogue.ts  ◀── falls back to
                                    │              src/lib/catalogue-data.ts
                                    ▼
                     Server Components (src/app/**)
                                    │
                                    ▼
                           HTML to the browser
```

## The one seam

**`src/lib/catalogue.ts` is the only place the site gets content from.** Every
page calls it; nothing else talks to Sanity.

It tries Sanity, and returns the static catalogue when Sanity is not configured
or a request fails. That means:

- The site builds and runs with no CMS credentials at all
- A Sanity outage degrades the shop to static content rather than taking it down
- A new developer can change where content comes from by editing one file

If you are adding a data source, add it here rather than fetching in a page.

## Rendering

| Route                         | Mode    | Why                                       |
| ----------------------------- | ------- | ----------------------------------------- |
| `/`, `/about`, legal          | Static  | No request-time input                     |
| `/products/[slug]`            | SSG     | `generateStaticParams` over every product |
| `/shop`, `/shop/[category]`   | Dynamic | Reads `searchParams` for filters          |
| `/sitemap.xml`, `/robots.txt` | Static  | Generated from the catalogue              |

Sanity responses are cached for 60 seconds and tagged `catalogue`, so a
deployment is not needed for content edits to appear.

## Server and client boundary

Almost everything is a Server Component. Only these are client-side, and each
for a specific reason:

| Component                                                               | Why it must be a client component       |
| ----------------------------------------------------------------------- | --------------------------------------- |
| `CartProvider`                                                          | Holds state, reads localStorage         |
| `CartDrawer`, `CartContents`, `AddToCart`, `CardAddToCart`, `CartBadge` | Consume cart state                      |
| `ProductGallery`                                                        | Tracks the selected image               |
| `MobileNav`                                                             | Sheet open state                        |
| `NavLink`                                                               | Needs `usePathname` for the active link |
| `SortSelect`                                                            | Pushes router updates                   |
| `ContactForm`                                                           | Client-side validation                  |

Filters are deliberately **not** client components. Category and heat filters
are ordinary links that set URL params, so filtering works without JavaScript,
every filtered view is shareable, and the state survives a refresh.

## Cart

State lives in a reducer inside `CartProvider`, persisted to `localStorage`
under `efamy.cart.v2`.

Lines are keyed by `productId:size`, because the same product in two sizes is
two separate lines.

**Line prices are a display snapshot.** They are what the price was when the
item was added. Checkout must re-price from the catalogue server-side before
charging. See `decisions.md` and `payments.md`.

## Types

`src/types/product.ts` is the domain model, and it is CMS-agnostic on purpose.
Sanity responses are mapped into it by `src/sanity/map.ts`. Components only ever
see the domain type, never a Sanity document.

That is what makes replacing the CMS a matter of rewriting one mapper.

## Styling

Tailwind v4 with tokens defined in `src/app/globals.css`. Colours are derived
from the logo; every text pair is checked against WCAG AA. See
`decisions.md` for why there are both `--gold` and `--gold-ink`.

No dark mode, deliberately. The storefront is photography-led and a single warm
theme keeps product imagery consistent.

## What is not here

- No custom backend or database. Sanity is the datastore.
- No authentication. There are no customer accounts.
- No payment processing yet. `/checkout` is a placeholder.
- No test suite. The type checker and the production build are the safety net,
  which is thin. Worth adding tests around cart maths and price formatting
  before the money is real.

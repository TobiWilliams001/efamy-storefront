# Integrations

Every third-party service the site touches, live or planned.

## Live

### Sanity — content

The product catalogue. Two document types, `product` and `productCategory`,
defined in `studio/schemaTypes/`.

- **Read**: `src/sanity/` — client, GROQ queries, mappers
- **Consumed by**: `src/lib/catalogue.ts` only
- **Fails how**: the client is built lazily and returns `null` when
  unconfigured. Every fetch is wrapped, so an outage falls back to the static
  catalogue rather than erroring
- **Config**: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`

Adding a field means changing it in four places: the Studio schema, the GROQ
projection in `queries.ts`, the mapper in `map.ts`, and the domain type in
`types/product.ts`. Miss one and the field silently never appears.

### Vercel — hosting

Builds and serves the storefront. See `deployment.md`.

### Google Analytics 4 — optional

`src/components/analytics.tsx`, loaded with `afterInteractive` so it never
blocks rendering.

Renders **nothing** unless `NEXT_PUBLIC_GA_ID` is set, which keeps local and
preview traffic out of the production property.

Note: no cookie consent banner exists. GA4 sets cookies, and UK/EU rules
generally require consent before non-essential cookies. **Resolve this before
launch** — either add a consent gate or configure GA4 in a consentless mode.

## Planned, with the seam already in place

### Resend — transactional email

The contact form (`src/app/contact/actions.ts`) validates on the server and is
ready to send, but there is no provider wired up.

Without `RESEND_API_KEY` the form **tells the user honestly that sending is not
connected** and gives the email address instead. It does not pretend to have
sent anything.

To finish: add the key, install the SDK, replace the placeholder branch.

### Stripe — payments

`/checkout` is a holding page. It explains that payment is being connected and
offers ordering by email. It deliberately collects no card or address details:
a form that looks real but goes nowhere is worse than an honest gap.

When wiring it up:

- **Stripe Checkout** (hosted, redirect) is the recommendation. Card data never
  touches this codebase, PCI scope stays minimal, and 3-D Secure and wallets
  come free
- **Re-price server-side.** Cart line prices are a display snapshot held in
  `localStorage`. Never charge from them. Read the catalogue, recompute, then
  create the session
- **Verify webhook signatures** with `STRIPE_WEBHOOK_SECRET`
- The account must belong to the client's legal entity, not a developer's

See `payments.md` for the rules that apply to money in this codebase.

## Deliberately absent

| Not used                | Why                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| Customer accounts       | Nothing needs them yet. Guest checkout covers it                                                              |
| A database              | Sanity is the datastore. Orders will live in Stripe                                                           |
| An email marketing tool | No newsletter yet                                                                                             |
| Error monitoring        | `src/app/error.tsx` logs to the console. Sentry or similar is worth adding before real traffic                |
| A test framework        | The type checker and production build are the only safety net. Thin, and worth fixing before payments go live |

## Adding an integration

1. Put the client in its own module under `src/`, not inline in a component
2. Make it fail soft. If the service is down, the shop should degrade, not break
3. Document the env vars by **name** in `environment-variables.md`, never values
4. Verify the build still passes with the variables absent:
   `mv .env.local /tmp/ && pnpm build`
5. Add it to this file

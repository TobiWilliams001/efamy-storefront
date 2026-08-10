# Handover

Written so this project survives any one person leaving it — including whoever
built it.

## Who owns what

**Fill this in and keep it current. An out-of-date list is worse than none.**

| Thing                    | Owner account | Who has access | Billed to |
| ------------------------ | ------------- | -------------- | --------- |
| Domain                   |               |                |           |
| GitHub repository        |               |                |           |
| Vercel project           |               |                |           |
| Sanity project           |               |                |           |
| Google Workspace / email |               |                |           |
| Google Analytics         |               |                |           |
| Stripe                   |               |                |           |
| Password manager         |               |                |           |

### The rule

**Every account is owned by Efamy Foods and billed to Efamy Foods.** Developers
are invited as members, never as owners.

This protects both sides. The business is never locked out of its own
storefront, and the developer is not holding liability for systems they do not
own.

Two things in particular:

- **Stripe must be the client's legal entity.** It is their revenue, their tax
  position, and their chargeback liability. Processing another business's
  payments through your own account also generally breaches Stripe's terms.
- **The domain must be registered to the client.** Whoever renews it controls
  the brand.

### Setting this up when the client is not technical

Do not share a password long-term. You only need it once:

1. Sit with them, on a call or in person
2. **They create the account and type the password themselves.** Their phone as
   the recovery number
3. You drive the screen and create the GitHub org, Vercel team and Sanity project
4. **Before you log out, invite your own email as an admin on each**
5. From then on, work from your own account

Step 4 is the point. Once you are a separate member, they can change their
password without locking you out, you get your own two-factor, and there is an
audit trail of who changed what.

Store their credentials in a password manager they own — Bitwarden is free. Not
a Drive document, not a chat message.

## Current state

**Working:** browse, filter and sort products; product pages with sizes,
ingredients, allergens, storage and FAQs; a basket that persists; a validated
contact form; sitemap, robots and structured data; a CMS for products.

**Not working yet:**

| Gap                  | Blocked on                                    |
| -------------------- | --------------------------------------------- |
| Payments             | A Stripe account in the client's name         |
| Contact form sending | An email provider key                         |
| Legal pages          | Qualified review — they are drafts and say so |
| Cookie consent       | A decision, before analytics goes live        |
| Recipes              | Content                                       |
| Real photography     | A shoot, or properly licensed images          |

**Known content gaps:** net weights for several products, no nutrition data, no
stockist list, blank phone/WhatsApp/social, six of nine dish tiles without
photos.

## Before launch

- [ ] Custom domain, with `NEXT_PUBLIC_SITE_URL` updated and a redeploy
- [ ] Legal pages written and reviewed
- [ ] Cookie consent resolved
- [ ] Stripe live, with server-side re-pricing
- [ ] Delivery costs and timescales confirmed and published
- [ ] Contact details filled in
- [ ] Prices double-checked against the client's price list
- [ ] Allergens verified against the physical jars
- [ ] **Delete `exampleTestimonials` from `src/lib/testimonials.ts`.** Three
      placeholder quotes render on the home and product pages while no real ones
      exist. They carry a visible "Example" tag, so nothing is passed off as a
      genuine review — but they must not survive launch. Adding real entries to
      `testimonials` hides them automatically
- [ ] Test a real order end to end
- [ ] Error monitoring
- [ ] Google Search Console, and the sitemap submitted

Note on prices: the supplied trade list has **Beans 800g at £66 for a 12-pack
and £68 for a 6-pack** — the larger pack is cheaper, which is almost certainly a
typo. It is trade pricing so it does not appear on the site, but it should be
confirmed.

## Backups

**Content** — export the whole dataset, images included:

```bash
cd studio && npx sanity dataset export production backup.tar.gz
```

Worth doing before any schema change, and on a schedule once real orders exist.

**Code** — the git repository. Make sure it lives in an organisation the
business owns, not a personal account.

**Orders** — will live in Stripe once payments are connected.

## If the developer disappears tomorrow

1. The business owns the accounts, so nothing is lost
2. The stack is deliberately mainstream — Next.js, TypeScript, Tailwind, Sanity,
   Vercel. Any competent React developer can pick it up
3. `getting-started.md` gets a new developer running locally
4. `architecture.md` explains the shape, `decisions.md` the reasoning
5. `troubleshooting.md` covers what has actually broken before
6. The site keeps running regardless. It is static-first and degrades to a
   built-in catalogue if the CMS is unreachable

The things that would genuinely hurt: losing the domain, losing the Sanity
project, or losing the repository. All three are ownership problems, not
technical ones — which is why the table at the top of this file matters more
than the rest of it.

## Reducing the dependency further

The client can manage products today. They cannot change page copy, the About
page, FAQs or stockists — those are in code.

**Moving site copy into Sanity is the highest-value next step for independence.**
The pattern already exists; it is the same shape as the product schema.

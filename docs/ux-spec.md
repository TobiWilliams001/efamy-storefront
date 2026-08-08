# UX and conversion spec

A forward plan for the storefront, written against the 2026 ecommerce brief.

`design-system.md` documents what is **built**. This document covers what
should change and what is **blocked**, and is honest about the difference. Every
item is marked:

- **Built** — shipped and verifiable in the running site
- **Ready** — buildable now, no client input needed
- **Blocked** — needs information or an account only Efamy can supply

## The brief's questions, answered

The template asks five questions. Forty turns of work already answered them, so
they are recorded here rather than asked. Correct anything that is wrong.

| Question     | Answer                                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand        | Efamy Food Products — Ghanaian chilli sauces and seasonings, made in Kettering since 2008                                                       |
| Niche        | Food and beverage. Ambient, shelf-stable, repeat purchase                                                                                       |
| Customers    | UK households cooking West African food, the Ghanaian diaspora buying what they grew up with, cooks discovering it, and independent grocers     |
| Personality  | Premium, warm, authentic, confident. Explicitly **not** supermarket-bright or folksy — the client rejected "dull" and approved a bold warm look |
| Primary goal | First purchases. There is no order history, no accounts and no subscription plumbing, so AOV and retention are second-order                     |
| Tech         | Next.js 16 App Router, React 19, Tailwind v4, Sanity for products only, Vercel. Not Shopify — every commerce primitive is ours to build         |
| Priority     | PDP and checkout. The PDP is where the trust gap is; checkout does not exist yet                                                                |

## What the brief asks for that Efamy cannot honestly ship

Three items in the template are wrong for this business today. They are listed
first because building them would cost credibility, not gain it.

### Star ratings and review counts

The brief asks for ratings on product cards and PDPs, and verified-buyer marks
on reviews. **Efamy has no reviews.** Not few — none. The site has never taken
an order.

Placeholder stars, seeded ratings, or "4.8 (127)" as design filler are
fabricated social proof. For a food brand that is a trading-standards problem as
well as a reputational one, and it is the single fastest way to lose a customer
who notices.

**Instead**, and this is the higher-value move: fifteen years of trading is real
social proof that has never been collected. See _Trust_ below.

### Checkout with express wallets

Apple Pay and Google Pay require a payment processor. **There is no Stripe
account** — it needs the company details, a business bank account and ID
verification, and only Efamy can open it.

Until then `/checkout` collects the basket and sends it by email, which is
honest and works. The full flow is specified below so it can be built the day
the keys exist.

### AI personalisation

"Recommended for you" and "customers also bought" need behavioural data. There
are no accounts, no order history and no sessions to learn from. Shipping this
now means hard-coded lists wearing an AI label.

What is genuinely available today is **editorial** recommendation — pairings
chosen by the person who makes the sauce, which for a 15-year-old food business
is more persuasive than a cold-start algorithm anyway.

---

## 1. Design system

Fully documented in `design-system.md`. Deltas only.

**Colour — Built.** Two-tier palette, every pair measured against WCAG AA. The
rule that matters: `--brand-bright` (#FC0D13) and `--gold` (#CB9954) are the
true logo colours and **fail as text**; `--brand` (#8B2D2D) and `--gold-ink`
(#96682C) are their accessible siblings. Fills versus letterforms.

**Missing tokens — Ready.** The brief asks for error and success scales.
`--destructive` exists; success is currently borrowed from `--sage-ink`. Promote
to explicit `--success` / `--success-bg` so a confirmation state is not
semantically a dietary badge.

**Dark mode — deliberately omitted.** Photography-led, single warm theme, and
the jar labels need consistent surroundings. Documented as a decision, not an
oversight.

**Typography — Built.** Two families, which meets the 1–2 rule. Manrope
variable (200–800) and DM Serif Display 400. Section headings use
`display-title`.

**Motion — Built but under-specified.** 200–300ms, `prefers-reduced-motion`
honoured. **Ready:** publish the easing curve alongside the durations so hover,
tap and drawer transitions stop being decided per component.

**Components — mostly Built.** Buttons (5 variants, `xl` = 44px minimum),
inputs with `aria-invalid` error states, cards, badges, header, mobile drawer,
sheet, skeleton, empty state.

**Missing — Ready:**

- **Toast.** Adding to cart currently opens the drawer. That is heavier than the
  action deserves on mobile. A toast with an Undo is the standard pattern.
- **Breadcrumbs.** The brief asks for them; the client explicitly asked for
  "Home / Shop" to be removed from every page. **Client instruction wins.**
  Structured-data `BreadcrumbList` can stay in the markup for search engines
  without rendering anything visible.

## 2. Homepage

**Built:** transparent header over a full-bleed dark hero, meal carousel, why
choose Efamy, recipe inspiration, About band, product showcases, footer with
newsletter.

**Hero — Built.** "Bold flavour. Made with love." with the gold second line,
four trust circles, dual CTA.

The brief prefers a benefit-led H1. "Bold flavour" is a promise, not a benefit,
but it is what the client approved and is publicly posting. Not worth
relitigating. The subhead carries the substance: _"Ghanaian chilli sauces and
seasonings, made in the UK since 2008."_

**Bento grid — Ready.** The strongest remaining homepage change. Replace the
uniform category cards with an asymmetric grid: one large block for chilli
sauces, a tall block for the seasonings, two small blocks for Recipes and Our
Story. It suits a range with two very different halves and gives the range
photograph somewhere to breathe.

**Value proposition strip — Blocked.** Wants "Free delivery over £40" and
"2–3 working days". Delivery cost, timescale and threshold are all unknown.
Inventing a threshold is a promise the business has to honour. The four hero
trust circles carry the load until the real numbers arrive.

**Social proof bar — Blocked**, see Trust.

**Copy — Ready.** Current CTAs are "Shop now" and "View all recipes". The brief
prefers "Add to Basket" over "Add to cart" for UK English; the site already
uses basket language in the cart and cart in the buttons. Pick one — **basket**,
since the audience is British.

## 3. Product listing page

**Built:** centred header, pill filters (category, heat, dietary), sort, live
result count, responsive grid, empty state with a clear-filters action.

**Grid — Built.** 1 / 2 / 3 / 4 columns. The brief's 3–4 desktop columns is
met. Five across, as in the mockup, leaves the card too narrow for name,
strength, price and button.

**Filters — Built on desktop, Ready on mobile.** They currently wrap as pills on
small screens. A bottom-sheet drawer with an apply button and a count is the
better mobile pattern, and `sheet.tsx` already exists.

**Price filter — Ready.** The brief asks for one. Sauces run £2.75 to £12.50, a
wide enough spread to matter.

**Dietary filter — Built, deliberately limited.** Vegan and vegetarian only. No
"gluten free" option, because an allergen absent from our data means _not
transcribed_, not _not present_. Offering it would be a safety claim we cannot
make. This constraint should survive any redesign.

**Pagination — Ready, recommendation: none.** Twelve products. Neither
pagination nor infinite scroll is warranted. If the range grows past ~40 — the
seven chilli oils plus Goat and Turkey would nearly double it — use a **Load
more** button rather than infinite scroll: it keeps the footer reachable, keeps
the back button honest, and is far kinder to screen readers.

**Card — Built.** Accent band, cut-out on gradient, name, strength, summary,
dietary and allergen chips, price with `from` when sizes vary, size count, add
button. **Blocked:** the rating row the brief wants.

## 4. Product detail page

**Priority page.** Most of the structure exists; the content does not.

**Above the fold — Built.** Name, price, gallery, add to cart, sticky bar on
scroll.

**Gallery — Built, starved.** It supports lifestyle, texture, ingredients and
scale shots. **Every product has exactly one image: a jar on white.** This is
the single biggest conversion gap on the site and no amount of layout work
substitutes for it. Shot list in `photography-brief.md`.

The texture close-up now matters more than first assessed — the old website
says _"our chilli sauces contain meat and fish chunks"_, which is the real
differentiator against every smooth hot sauce on a supermarket shelf, and it
cannot be communicated in words alone.

**Specs — Built, mostly empty. Blocked.** Fields exist for ingredients,
allergens, nutrition, storage, shelf life and certifications. Ingredients are
transcribed for two of twelve products. Nutrition exists for none.

**These must come off the physical jars and must never be estimated.** Wrong
allergen data on food is a safety and legal matter, not a copy error.

**Cross-sell — Ready.** Editorial rather than algorithmic: "Perfect with"
driven by the existing dish pairings, and a recipe card linking to a dish that
uses this jar. Both datasets already exist.

**Trust microcopy near the CTA — Blocked** on delivery terms.

## 5. Cart and checkout

**Cart drawer — Built.** Line items, quantity controls, subtotal, keyed by
`productId:size`.

**Free-shipping progress bar — Blocked.** The single highest-value AOV
mechanism available to this business, and it needs one number from the client.
Worth chasing specifically.

**Promo codes — Ready, recommend deferring.** No discount engine, no campaign
plan, and an inert promo field measurably depresses conversion — people leave to
hunt for a code they never find.

**Checkout — Blocked on Stripe.** Specification for the day it exists:

- Guest checkout, two steps: delivery, then payment. No forced account
- Express wallets **above** the form, before the customer commits to typing
- Postcode lookup on the address field. For a UK food brand this is the single
  biggest mobile friction saving
- Inline validation on blur, never on keystroke
- Full cost breakdown before the payment step — no late shipping surprises
- `autocomplete` attributes on every field, which is most of "autofill" for free

**Legal — Blocked.** Privacy, Terms and Returns are drafts and marked as such.
Food returns are genuinely not standard: sealed and perishable goods carry
specific exemptions from the 14-day right to cancel. This needs a qualified
review before the first order, not before launch.

## 6. Mobile and global UI

**Header — Built.** Logo, nav, cart. Transparent over the home hero, solid
elsewhere and once scrolled.

**Search — Ready.** The brief and mockup both show it. Twelve products do not
need search; forty will. Build it when the oils land, not before.

**Account icon — deliberately absent.** No auth exists. An icon that does
nothing is worse than no icon.

**Mobile menu — Built.** Full-screen drawer.

**Bottom bar — Ready, recommend against.** The brief lists it as optional. It
costs permanent vertical space on the viewport where the buy button lives, and
the sticky add-to-cart already occupies that zone on the page that matters. Two
sticky bars competing is a worse experience than one good one.

**Toasts — Ready.** See Design system.

**Empty and error states — Built.** Empty cart, no filter matches, 404.

## 7. Trust — the real opportunity

This replaces the brief's ratings and AI sections, and is the highest-value
recommendation in this document.

**Efamy has been trading since 2008 and has never collected a single review.**
That is fifteen years of customers, nine stockists across five counties, and
repeat trade buyers — all invisible to a first-time visitor.

Three things, in order of value:

1. **Ask past customers for quotes.** Even six, with first names and towns, would
   change how every page reads. Costs nothing but a conversation and is the
   fastest credibility gain available.
2. **Turn on reviews after launch.** Real ones, verified against real orders.
   Design the card and PDP slots now so nothing needs rebuilding, but render
   nothing until there is something true to render.
3. **Lead with what is already provable.** Since 2008. Made in Kettering. Nine
   stockists, named and listed. Meat and fish chunks you can see. No colours,
   additives or preservatives. All verifiable, all currently under-used.

**Certifications — Blocked.** SALSA, BRC, organic, halal. Fifteen years of
trading usually means at least one, and a certification badge beside the price
does the job the brief wanted stars to do — honestly.

## Priority

**Not blocked — build in this order:**

1. Toast on add to cart, replacing the drawer interruption
2. Bento grid on the homepage
3. Mobile filter drawer
4. Editorial cross-sell on the PDP
5. Explicit success token; published easing curve
6. Price filter

**Blocked — chase in this order, most valuable first:**

1. **Photography.** Nothing else moves the needle as far
2. **Ingredients and allergens** off the physical jars — also a legal blocker
3. **Delivery cost, timescale and free-delivery threshold** — unblocks the
   progress bar, the value strip and the trust microcopy in one answer
4. **Stripe account** — unblocks checkout entirely
5. **Customer quotes** — cheapest credibility available
6. **Certifications**

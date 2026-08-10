# Business reliability audit

Audited against a running production build, not the source. Every "verified"
line below was measured. Dated August 2026.

Status key: **OK** — verified working · **Gap** — real, needs action ·
**Blocked** — needs an account, a decision or information only Efamy can give.

---

## A. Foundations

| Item                      | Status      | Evidence                                                                     |
| ------------------------- | ----------- | ---------------------------------------------------------------------------- |
| Hosting / CDN             | OK          | Vercel edge network, automatic HTTPS and certificate renewal                 |
| HTTPS, no mixed content   | OK          | Every asset is same-origin or `https://cdn.sanity.io`                        |
| PCI handling              | OK          | Stripe hosted Checkout. No card data reaches this application (SAQ-A)        |
| Cookie consent            | OK          | Analytics loads only after acceptance — verified in `analytics.tsx`          |
| Privacy / Terms / Returns | **Blocked** | Drafts, marked as such on the site. Need qualified review                    |
| Analytics installed       | OK          | GA4, consent-gated, no ID means no script                                    |
| **Revenue tracking**      | **Fixed**   | Was pageviews only. Now fires `add_to_cart`, `begin_checkout` and `purchase` |
| **Error tracking**        | **Gap**     | None. See below                                                              |
| **Uptime monitoring**     | **Gap**     | None. See below                                                              |

### Revenue tracking — what changed

GA4 recorded pageviews and nothing else, so every conversion question — which
products sell, where checkout is abandoned, what an order is worth — was
unanswerable.

Now instrumented: `add_to_cart`, `begin_checkout`, `purchase`.

`purchase` is the one that matters, and it is deliberately wired so analytics
cannot disagree with the bank:

- it renders **only after Stripe confirms payment**, so it can never report a
  sale that did not happen
- the GA4 `transaction_id` **is** the Stripe session id, so GA4 deduplicates a
  refresh instead of counting the order twice
- the value comes from `amount_total` on the Stripe session, not from the
  browser's basket

`track()` swallows its own errors. A tracking failure must never break a
checkout.

### Error tracking — the real gap

Nothing reports a server exception today. The Stripe idempotency bug that broke
checkout was found only because someone tried to buy something and told us.

Recommended: Sentry's free tier. Not installed, because it needs an account in
the business's name and adds a dependency the business must then own — that is
Efamy's decision, not a default.

### Uptime monitoring — the real gap

Nothing would notice if the site went down at 3am. A free UptimeRobot or Better
Stack check on `https://efamys.co.uk` every 5 minutes, alerting
`info@efamys.co.uk`, is ten minutes of setup.

Worth checking a real URL rather than the homepage alone — a working homepage
with a broken checkout looks fine to a naive monitor.

---

## B. Performance

Measured on a production build at 390px, simulating an iPhone.

| Metric              | Measured                                            | Target     |
| ------------------- | --------------------------------------------------- | ---------- |
| Homepage first load | **300KB**                                           | good       |
| HTML (gzipped)      | 20.5KB                                              |            |
| JS                  | 212.6KB                                             | reasonable |
| CSS                 | 14.1KB                                              |            |
| Eager images        | 53KB (2 of 18)                                      |            |
| Image preloads      | 1 (the hero)                                        |            |
| Third-party scripts | **1** — GA4 only, consent-gated, `afterInteractive` |

All images are served AVIF with a WebP fallback, capped at 1600px because
nothing renders wider than 1280.

**Two defects found and fixed:** the footer logo carried `priority`, preloading
a below-the-fold image against the hero's LCP; and the homepage eager-loaded two
product cards that sit below a 580px hero on a phone. Preloads went 4 → 1.

**CLS** is structurally protected — fonts are self-hosted via `next/font`, and
every image has explicit dimensions or `fill` inside a sized parent.

**LCP and INP still need field data.** Lab numbers on localhost are not real. Run
PageSpeed Insights against the live domain after launch, and watch Search
Console's Core Web Vitals report once traffic exists.

### Error resilience — verified

| Failure                    | Behaviour                                                                 |
| -------------------------- | ------------------------------------------------------------------------- |
| Stripe unreachable         | "We could not start payment just now" plus the email address; logged      |
| Payment declined           | Handled by Stripe, customer stays on their page and can retry             |
| Customer abandons Stripe   | Returns to `/cart` with the basket intact                                 |
| Price changed mid-basket   | Re-priced server-side; a mismatched basket is refused, never part-charged |
| Out of stock at checkout   | Refused with "One of the items has gone out of stock"                     |
| Success URL typed directly | "No order found" — never a false confirmation                             |
| Payment still settling     | "Confirming your payment", tells them nothing is lost                     |
| Email provider down        | Order still recorded in Stripe; the failure is logged, never fatal        |

---

## C. Findability

| Item                | Status      | Evidence                                                      |
| ------------------- | ----------- | ------------------------------------------------------------- |
| robots.txt          | OK          | Allows all, disallows `/cart`, `/checkout`, `/design`         |
| Sitemap             | OK          | 28 URLs, all canonical                                        |
| Titles              | OK          | Unique, all under 60 characters — measured across 9 templates |
| One H1 per page     | OK          | Verified on every template                                    |
| Meta descriptions   | OK          | All under 160. About was 174 and has been shortened           |
| Product schema      | OK          | Product + AggregateOffer + Brand                              |
| Organization schema | OK          | Site-wide                                                     |
| Recipe schema       | OK          | Recipe + HowToStep                                            |
| FAQPage schema      | OK          | On `/faq`                                                     |
| **BreadcrumbList**  | **Fixed**   | Added to product pages, invisible — see below                 |
| Review schema       | **Blocked** | No reviews exist. Never fabricate them                        |
| Image alt text      | OK          | Describes the product, not the photograph                     |

**Breadcrumbs.** The client asked for the visible "Home / Shop" trail to be
removed everywhere, and that stands. `BreadcrumbList` gives Google the hierarchy
for its results trail without putting anything back on screen.

**Search Console is not set up.** Nobody can see indexing errors, 404s or Core
Web Vitals without it. Verify the domain and submit `/sitemap.xml` at launch.

**AI search readiness** is genuinely good: factual copy, no marketing filler,
strong structured data. The weakness is thin product facts — ten of twelve
products have no ingredients, and none have nutrition. That is the same blocker
as everywhere else.

---

## D. Conversion

Covered in `ux-spec.md`. Summary of what is verified working: server-priced
guest checkout with no account required, Apple Pay and Google Pay via Stripe,
delivery shown before payment, sticky add-to-cart on product pages, filters by
category, heat and dietary claim, and honest empty states throughout.

**Not measurable yet.** Bounce rate, add-to-cart rate and checkout abandonment
all need traffic. The events now exist to answer them the day it arrives.

---

## E. Content and brand trust

| Item                                 | Status                                                   |
| ------------------------------------ | -------------------------------------------------------- |
| Founder story, dated 2008            | OK — from the client's own site                          |
| Nine named stockists                 | OK                                                       |
| Real contact details, address, hours | OK                                                       |
| Tone consistency                     | OK — passed in the product-wide copy review              |
| **Photography**                      | **Blocked** — the single biggest visible gap             |
| **Customer reviews**                 | **Blocked** — fifteen years of customers, none collected |
| **Ingredients and allergens**        | **Blocked** — two of twelve products                     |

---

## F. Operations

| Item               | Status      | Notes                                                           |
| ------------------ | ----------- | --------------------------------------------------------------- |
| Content updates    | OK          | Sanity Studio for products and categories, `cms-guide.md`       |
| Code rollback      | OK          | Vercel keeps every deployment; promote a previous one instantly |
| Content backup     | OK          | Sanity retains document history                                 |
| Catalogue fallback | OK          | Static catalogue means the shop survives a Sanity outage        |
| Documentation      | OK          | 15 documents, including decisions and troubleshooting           |
| **Ownership**      | **Blocked** | Accounts still need transferring to business-owned logins       |

---

## The list, in priority order

**Efamy must do these — nobody else can:**

1. Complete Stripe onboarding. The account cannot take a real payment today
2. Confirm delivery cost and timescale. Blocks checkout going live
3. Have the legal pages reviewed
4. Transfer ownership of Vercel, Sanity, the domain and Stripe to business logins

**Quick wins, an hour in total:**

5. Uptime monitor on the live URL
6. Google Search Console, and submit the sitemap
7. Stripe receipt emails — Settings → Customer emails
8. Sentry, if the business wants server errors reported

**Worth the most for the money:**

9. Photography
10. Ask past customers for quotes
11. Ingredients and allergens off the jars

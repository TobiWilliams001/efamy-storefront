# Decisions

The non-obvious choices and why. If something here looks wrong, read the
reasoning before changing it — most of these were made after hitting the
alternative.

## Money is stored in pence, as integers

`£4.75` is `475`. Everywhere: the domain type, Sanity, the cart, and eventually
Stripe.

Floating point cannot represent `0.1` exactly, so decimal money accumulates
rounding errors across a basket. Every payment provider expects minor units for
the same reason.

`formatPrice()` converts for display and is the only place division happens.

## Price lives on the variant, not the product

Sauces sell in 175g, 250g, 500g and 800g at different prices, so a single price
on a product cannot represent reality.

Cards show "from" the cheapest variant. Product schema emits an
`AggregateOffer` with a low and high price.

The alternative — one product per size — would have meant 28+ near-duplicate
products competing with each other in search and cluttering the shop.

## Cart line prices are a display snapshot

The cart stores the price at the moment of adding, because it renders a subtotal
without refetching.

**Checkout must re-price from the catalogue server-side before charging.** A
price sitting in `localStorage` is user-editable; charging from it is a pricing
exploit. See `payments.md`.

## Cart lines are keyed by `productId:size`

The same sauce in two sizes is two lines, not one. The storage key is
`efamy.cart.v2` — bumped from v1 when line identity changed, because old carts
had no line ID and quantity edits would have silently failed.

## The catalogue has one seam, with a static fallback

`src/lib/catalogue.ts` is the only place content is fetched. It reads Sanity when
configured and returns a built-in catalogue when not.

Three benefits: the site builds with no credentials, a CMS outage degrades
instead of breaking, and swapping the CMS means rewriting one mapper.

## The Sanity client is built lazily

`createClient` throws on an empty project ID. At module scope that took the whole
build down wherever the env vars were absent — which is how it broke on Vercel.

`getSanityClient()` builds on first use and returns `null` when unconfigured.
**Do not construct third-party clients at module scope from environment
variables.**

## The Studio is standalone, not embedded

`sanity dev` runs on Vite and is far faster than compiling the Studio through
Next. Standalone Studios also auto-update, which an embedded one cannot.

It also keeps the content model from becoming website-shaped.

## Filters are links, not client state

Category and heat filters are ordinary `<Link>`s that set URL params. Filtering
works without JavaScript, every filtered view is shareable and crawlable, and
the state survives a refresh. Only sorting needs the client.

## Colours are sampled from the logo

The palette was originally invented alongside the mark. Decoding the logo PNG
gave `#FC0D13` scarlet and `#CB9954` tan — both warmer than what they replaced.

Neither can carry text: 3.80:1 and 2.41:1 on ivory, and white on the scarlet is
only 4.03:1, so it cannot be a button either. **The bright values are
decorative; each has an accessible sibling one step deeper.** That is why both
`--gold` and `--gold-ink` exist.

The action colour is `#8B2D2D` burgundy, which measured better than the scarlet
in both directions.

## No dark mode

The storefront is photography-led and a single warm theme keeps product imagery
consistent. The `dark:` variant stays defined so shadcn components that ship it
remain inert rather than erroring.

## Images use `loading` and `fetchPriority`, not `priority`

`priority` is deprecated in Next.js 16. `preload` is reserved for a single
unambiguous LCP image — never a grid, where the LCP element varies by viewport.

Quality overrides are avoided: Next 16 restricts `qualities` to `[75]` by
default and returns **400** for anything else.

## `/shop` sits in a route group

`app/shop/(overview)/` exists so that its `loading.tsx` does not also wrap
`/shop/[category]`. It did, and the streamed shell committed a 200 status before
`notFound()` ran — so unknown categories returned 200 instead of 404.

## Product images render `object-contain` on white

`cover` crops the jars, so the card frame is square and the cutout is contained
inside it.

That makes the jar's height as a share of its own image the thing the customer
sees. The sources ranged from 67% to 97% and the jars looked like different
sizes on one row, so every cutout is now pasted unscaled onto a square canvas
sized to put the jar at 88% of it. Re-frame, never rescale: the pixels are
untouched and nothing softens.

All cutouts are transparent PNGs. The seasoning jars and the oil bottles
arrived opaque on near-white with a soft grey contact shadow, and were keyed:
a flood inward from the border over near-white only, so white on the labels
survives, then a second permissive pass confined to the base of the silhouette,
which takes the shadow without eating the white lids. The frame stays `bg-white`
regardless — the cutouts are clean, but the card is not the only surface and
white is the safe default.

Shape is not uniform and cannot be made so in code: the range mixes round
tapered jars with square ones. That needs a photograph, not a script.

## Sanity merges over the bundled catalogue rather than replacing it

The dataset is filled one document at a time. Replacing on the first non-empty
response meant the first product created in the Studio would take the shop from
seventeen products to one — and the trigger was _empty_, not _absent_, so it
would have fired silently the moment anyone started entering content.

`mergeBySlug` keeps the bundled entries as the base: a Sanity document wins
wherever its slug matches, unseen slugs are appended, and bundled order is
preserved so the shop does not shuffle as documents appear. Categories follow
the same rule, because a merged product list referencing a category that
replacement had dropped would break the filters.

The featured and best seller rows top up from the bundled curation when Sanity
flags too few, resolving the top-up through the merged list so an edited product
shows its current content.

Recipes still replace, deliberately: the bundled six are unapproved drafts and
should stop being reachable the moment real ones exist.

## Comments are rare

Only where the reasoning is not inferable from the code — pence as minor units,
the server-only env boundary, why two accent tiers exist, the cart price
snapshot. Everything else was removed deliberately.

## The Studio is excluded from the app's typecheck

Vercel installs root dependencies only, so `sanity` is absent when `next build`
type-checks. The root `tsconfig.json` excludes `studio`, which has its own.

## Deliberately not built

| Not built         | Why                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Search            | Ten products across two categories, with filters. It would add a control that solves nothing. Revisit past ~25 products |
| Customer accounts | Guest checkout covers the need                                                                                          |
| Reviews           | Cannot be faked, and there are none yet                                                                                 |
| Wishlist          | Little value at this catalogue size                                                                                     |

# Deployment

Two applications, two deployments, no shared build.

| App        | Where          | How                           | Automatic |
| ---------- | -------------- | ----------------------------- | --------- |
| Storefront | Vercel         | Push to the production branch | Yes       |
| Studio     | Sanity hosting | `pnpm deploy` in `studio/`    | No        |

## Storefront

Vercel builds on every push. The production branch is set in
**Settings → Git → Production Branch**. Other branches build as previews with
their own URLs.

Build command is `pnpm build`. Nothing custom.

### Before pushing

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm build
```

The production build catches the most. Two past deployments failed on things a
local build would have caught, both because the local machine had something CI
did not.

**When touching anything environment-dependent, verify without it:**

```bash
mv .env.local /tmp/ && pnpm build && mv /tmp/.env.local .
```

The site must build and serve products with no environment at all. That is the
static fallback doing its job, and it is easy to break without noticing.

### Rolling back

Vercel → Deployments → pick the last good one → **Promote to Production**.
Instant, no rebuild. Do this first when production is broken, then diagnose.

### The domain

Efamy is moving to **`efamy.co.uk`**. The old site sat on `efamys.co.uk` (with
an s), which is being retired — so anything still pointing at the old domain,
including email addresses, needs moving before it is dropped.

Vercel → Settings → Domains. Add `efamy.co.uk` and `www.efamy.co.uk`, then
follow the DNS instructions at whoever the domain is registered with.

Two things to sort out before switching the DNS over:

- **Find out where the domain is registered and who controls it.** Access to
  that account is as important as the Vercel and Sanity logins, and it belongs
  in the business's own name.
- **Email runs on this domain too.** Changing the wrong DNS record takes the
  mail down with the website. Only the A and CNAME records that point at the
  web host should change; leave the MX records alone.
- **Resend already has `efamy.co.uk` verified** — DKIM and SPF are green. If
  you touch SPF for anything else, merge it into the one record rather than
  adding a second; two SPF records on a domain is a permanent failure.

Do this before launch. Some UK mobile networks block `*.vercel.app` wholesale
because it is heavily used for phishing, so on those carriers the site is
unreachable until it has its own domain. This has already been observed on this
project.

After adding the domain:

1. Set `NEXT_PUBLIC_SITE_URL` to `https://efamy.co.uk` and redeploy, or the
   sitemap and social previews keep pointing at the old host
2. Add the domain to Sanity CORS (below)

## Environment variables on Vercel

Set in **Settings → Environment Variables**. `.env.local` is gitignored and
never leaves your machine, so anything missing here is simply undefined in the
deployed app.

| Variable                        | Development | Preview        | Production                    |
| ------------------------------- | ----------- | -------------- | ----------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | localhost   | preview URL    | `https://efamy.co.uk`         |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✓           | ✓              | ✓                             |
| `NEXT_PUBLIC_SANITY_DATASET`    | ✓           | ✓              | ✓                             |
| `STRIPE_SECRET_KEY`             | `sk_test_`  | `sk_test_`     | `sk_live_` **only when live** |
| `STRIPE_WEBHOOK_SECRET`         | CLI value   | endpoint value | endpoint value                |

### Do not put test keys in Production

With test keys on the public site the checkout looks completely live, but:

- a real customer entering a real card is **declined** — test mode only accepts
  test card numbers
- anyone who knows `4242 4242 4242 4242` can create fake orders in the dashboard

Both are worse than the honest fallback the site shows with no key set: _"Card
payment is not switched on yet. Email info@efamy.co.uk and we will take your
order."_ Leave Production without Stripe keys until the account is activated.

### The webhook secret is per endpoint

`STRIPE_WEBHOOK_SECRET` is **not** one value copied everywhere. Each endpoint
has its own:

- **Local:** printed by `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- **Deployed:** Stripe dashboard → Developers → Webhooks → add an endpoint at
  `https://<your-domain>/api/stripe/webhook`, subscribe to
  `checkout.session.completed`, then copy that endpoint's signing secret

Using the wrong one fails signature verification, and the route correctly
returns 400 rather than trusting the payload.

### Before switching Production to live keys

1. Efamy completes Stripe onboarding — the account currently has
   `charges_enabled: false` and cannot take a real payment
2. Real delivery rates in `src/config/delivery.ts`, with `provisional: false`.
   `assertDeliveryIsReal` throws on a `sk_live_` key while that flag is set, so
   nobody can be charged invented postage
3. Add the live webhook endpoint and its signing secret
4. Turn on Stripe receipt emails: Settings → Customer emails. The confirmation
   page tells the customer a receipt has been sent

## Studio

```bash
cd studio
pnpm deploy
```

Deploys to `<project>.sanity.studio`. Free, and it auto-updates itself, which
is why it is standalone rather than embedded in the Next.js app.

The Studio does **not** deploy when you push. If the content model changes,
deploy it deliberately.

### After changing the schema

```bash
cd studio
npx sanity schema deploy    # tells the Content Lake about the change
pnpm deploy                 # updates the hosted Studio
```

Then check the storefront still renders. A field rename that is not reflected
in `src/sanity/queries.ts` silently drops data rather than erroring.

### CORS

Every origin that reads Sanity from a browser must be allowed:

```bash
cd studio
npx sanity cors add https://your-domain --credentials
```

Needed for `localhost:3000`, the production domain, and any preview domain used
for real testing.

## Post-deploy checks

Worth thirty seconds after a production release:

- `/` renders with product images
- `/shop` lists products with real prices, not a single repeated price
- A product page loads and shows sizes
- `/shop/does-not-exist` returns 404, not 200
- `/sitemap.xml` contains the real domain, not localhost
- Add something to the basket and reload; it should persist

## Costs and ownership

Vercel and Sanity both run on free tiers at this scale. The domain and any
email are the only recurring costs.

**Everything should be billed to the business, not to a developer.** If a
personal card lapses, the shop should not go with it. See `handover.md`.

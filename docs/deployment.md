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

### Custom domain

Vercel → Settings → Domains. Add the domain and follow the DNS instructions at
the registrar.

Do this before launch. Some UK mobile networks block `*.vercel.app` wholesale
because it is heavily used for phishing, so on those carriers the site is
unreachable until it has its own domain. This has already been observed on this
project.

After adding the domain:

1. Update `NEXT_PUBLIC_SITE_URL` and redeploy, or the sitemap and social
   previews keep pointing at the old host
2. Add the domain to Sanity CORS (below)

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

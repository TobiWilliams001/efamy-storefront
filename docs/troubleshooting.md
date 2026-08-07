# Troubleshooting

Things that have actually gone wrong on this project, and what fixed them.

## Production is broken right now

**Roll back first, diagnose second.** Vercel → Deployments → last good one →
**Promote to Production**. Instant, no rebuild.

## The build fails on Vercel but passes locally

This has happened twice, and both times the cause was the same shape: **the
local machine had something CI did not.**

Reproduce properly before guessing:

```bash
mv studio/node_modules /tmp/     # CI installs root deps only
mv .env.local /tmp/              # CI has no local env file
pnpm build
# then move both back
```

### `Cannot find module 'sanity'` in the build log

The root TypeScript config was type-checking `studio/**`, but Vercel only
installs root dependencies. Fixed by excluding `studio` in `tsconfig.json`. The
Studio has its own config and is checked separately.

### `Configuration must contain 'projectId'`

The Sanity client was created at module scope, and `createClient` throws on an
empty project ID — so merely importing it killed the build wherever the env vars
were absent. Fixed by building the client lazily in
`getSanityClient()`, which returns `null` when unconfigured.

If you add another SDK, do the same. Never construct a third-party client at
module scope from environment variables.

## The site is up but I cannot reach it

### `ERR_CONNECTION_REFUSED` on the `.vercel.app` domain

**Almost certainly your network, not the site.** Vercel's edge always answers —
a broken deployment returns an error page, not a refused connection.

Some UK mobile networks block `*.vercel.app` wholesale because it is heavily
used for phishing. Confirm it:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://vercel.app/
curl -s -o /dev/null -w '%{http_code}\n' https://nextjs.vercel.app/
```

If unrelated Vercel domains also fail while `vercel.com` works, it is the
network. Switch to another connection or use a VPN.

**A custom domain fixes this permanently**, which is one more reason to buy one
before launch.

### A Vercel login wall

Settings → Deployment Protection → Vercel Authentication. On by default for some
projects; it makes the site load only for people signed in to your Vercel
account.

### `404: NOT_FOUND` on the production URL

Settings → Git → Production Branch. It defaults to `main`, which does not exist
in this repository. If it is wrong, every push has been building as a preview
and production has nothing behind it.

## Content problems

### An edit in the Studio does not show on the site

1. Wait a minute. Responses are cached for 60 seconds
2. Confirm it saved in the Studio
3. Check the browser console for a Sanity error

If the site is showing the **static** catalogue you will see all ten products
with the built-in prices, ignoring the CMS entirely. That means the env vars are
missing in Vercel, or every fetch is failing. Check the deployment logs for
`Sanity fetch failed`.

### A new field never appears

Adding a field takes four changes:

1. `studio/schemaTypes/` — the Studio schema
2. `src/sanity/queries.ts` — the GROQ projection
3. `src/sanity/map.ts` — the mapper
4. `src/types/product.ts` — the domain type

Missing the projection is the common one. It fails silently: no error, the field
is just never there.

### A product vanished from the site

`mapProduct` returns `null` — and the product is dropped — when it has no image,
no slug, no category, or no variants. Broken data is skipped rather than
rendering a half-product. Check those four fields in the Studio.

### Images are broken

The path in `catalogue-data.ts` or Sanity does not match a real file. Local
files live in `public/`; check the exact filename, including case.

For Sanity-hosted images, `cdn.sanity.io` must be in `remotePatterns` in
`next.config.ts`.

## Development problems

### `sanity: command not found`

`studio/node_modules` is missing or incomplete.

```bash
cd studio && pnpm install
```

This happened after moving the folder aside to reproduce a CI failure — the
`mv` succeeded but pnpm's symlink layout did not survive it.

### Type errors after changing a route

```bash
pnpm typecheck
```

runs `next typegen` first, which regenerates `PageProps` types. A plain `tsc`
will report stale errors.

### The image endpoint returns 400

Next.js 16 restricts `qualities` to `[75]` by default. Passing `quality={85}` to
`next/image` makes `/_next/image` return **400 Bad Request** — a broken image in
production that looks fine locally if cached.

Either drop the prop or add the value to `images.qualities` in `next.config.ts`.

### Tailwind classes not applying

Tailwind v4 scans source files for literal class strings. Dynamically composed
names like `` `text-${colour}-500` `` are never generated. Use complete class
names, or an inline `style` for genuinely dynamic values — which is what the
product accent bands do.

## When you are properly stuck

- `git log --oneline -20` — recent changes, with reasoning in the commit bodies
- `decisions.md` — why the non-obvious choices were made
- Vercel → Deployments → the failing build → full log
- Sanity Studio → Vision — run GROQ queries against real data

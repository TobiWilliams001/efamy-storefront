# Getting started

Everything needed to run the site and the CMS locally.

## Prerequisites

| Tool    | Version | Notes                                            |
| ------- | ------- | ------------------------------------------------ |
| Node.js | 24+     | Older versions will not run the seed script      |
| pnpm    | 10.33+  | Pinned in `package.json`; do not use npm or yarn |
| Git     | any     |                                                  |

If pnpm is missing: `corepack enable && corepack prepare pnpm@10.33.0 --activate`

## The two applications

This repository holds two apps that deploy separately.

```
efamy-storefront/
├── src/          the storefront          Next.js, deployed to Vercel
└── studio/       the CMS                 Sanity, deployed to sanity.studio
```

They share a repository but not a build. Vercel only ever builds the
storefront; the Studio is deployed by hand with `sanity deploy`.

## Running the storefront

```bash
pnpm install
cp .env.example .env.local     # then fill it in, see environment-variables.md
pnpm dev
```

Runs at **http://localhost:3000**.

The site works with an empty `.env.local`. Without Sanity configured it serves
the built-in catalogue in `src/lib/catalogue-data.ts`, so you can develop the
whole storefront without CMS access.

## Running the Studio

```bash
cd studio
pnpm install
pnpm dev
```

Runs at **http://localhost:3333**. Needs a Sanity account with access to the
project; ask whoever owns it for an invite.

Run both at once in separate terminals if you are changing the content model.

## Everyday commands

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `pnpm dev`          | Development server                                  |
| `pnpm build`        | Production build. Run before pushing anything risky |
| `pnpm start`        | Serve the production build locally                  |
| `pnpm lint`         | ESLint                                              |
| `pnpm typecheck`    | Generates route types, then `tsc --noEmit`          |
| `pnpm format`       | Prettier, writes changes                            |
| `pnpm format:check` | Prettier, fails instead of writing. Use in CI       |

Before pushing: `pnpm format && pnpm lint && pnpm typecheck && pnpm build`.
The build is the one that catches the most.

## Conventions worth knowing on day one

- **Money is in pence**, everywhere, as integers. `£4.75` is `475`. Format only
  at the point of display with `formatPrice()`. See `decisions.md`.
- **Internal URLs come from `src/lib/routes.ts`.** Do not type paths by hand.
- **`src/lib/catalogue.ts` is the only place content is fetched.** If you need
  product data, go through it.
- **Comments are rare and deliberate.** If something has one, it is because the
  reasoning is not obvious from the code.

## Where things live

```
src/
  app/            routes, layouts, sitemap, robots
  components/
    ui/           shadcn primitives, generated, edit sparingly
    layout/       header, footer, page header, container, section
    commerce/     product cards, gallery, filters
    cart/         cart state and UI
    sections/     composed page sections
    common/       generic building blocks
  config/         site and navigation configuration
  lib/            data access, formatting, domain helpers
  sanity/         client, queries, mappers
  types/          domain types
studio/
  schemaTypes/    the content model
public/           images and static assets, see public/ASSETS.md
docs/             this documentation
scripts/          one-off maintenance scripts
```

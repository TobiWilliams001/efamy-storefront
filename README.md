# Efamy Storefront

The digital storefront for **Efamy Food Products** — authentic Ghanaian chilli sauces, chilli oils and seasonings, made in the UK.

## Stack

| Concern    | Choice                             |
| ---------- | ---------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack) |
| Language   | TypeScript (strict)                |
| Styling    | Tailwind CSS v4 (CSS-first config) |
| Components | shadcn/ui (Radix primitives)       |
| Icons      | Lucide                             |
| Forms      | React Hook Form + Zod              |
| Packages   | pnpm                               |
| Hosting    | Vercel                             |
| CMS        | Headless CMS — not yet chosen      |
| Payments   | Not yet integrated                 |
| Email      | Not yet integrated                 |

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Scripts

| Script              | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Development server                        |
| `pnpm build`        | Production build                          |
| `pnpm start`        | Serve the production build                |
| `pnpm lint`         | ESLint                                    |
| `pnpm typecheck`    | Generate route types, then `tsc --noEmit` |
| `pnpm format`       | Prettier write                            |
| `pnpm format:check` | Prettier check (use in CI)                |

## Folder structure

```
src/
  app/          Routes, layouts, route handlers (App Router)
  components/
    ui/         shadcn/ui primitives — generated, edit sparingly
    layout/     Container, Section, and the site chrome (header, footer, nav)
    commerce/   Catalogue components (product card, category card, grid)
    common/     Generic building blocks (empty state)
    sections/   Composed page sections (hero, featured products, …)
  config/       Static brand/site configuration
  lib/          Framework-agnostic helpers (env, formatting, routes, cn)
  types/        Domain types (Product, ProductCategory)
  hooks/        Client-side React hooks
```

The rule of thumb: `app/` fetches and composes, `components/` renders, `lib/` computes. Data access stays out of components.

## Conventions

- **Server Components by default.** Add `"use client"` only where interactivity genuinely requires it, and push it as far down the tree as possible.
- **Money is stored in pence** (integer minor units) and only formatted for display via `formatPrice()`.
- **Environment variables are validated** in `src/lib/env.ts`. Client variables must be referenced as full `process.env.NEXT_PUBLIC_*` literals so Next.js can inline them.
- **No dark mode.** The storefront is photography-led; a single warm light theme keeps product imagery consistent.
- **Internal URLs come from `src/lib/routes.ts`.** Paths are never hand-typed in components.
- **Images use `loading`/`fetchPriority`, not `priority`.** The `priority` prop is deprecated in Next 16. Reserve `preload` for a single, unambiguous LCP image (the hero) — never for a grid, where the LCP element varies by viewport.

## Design tokens

Brand colours live as CSS variables in `src/app/globals.css`:

- Warm off-white background with warm near-black text
- **Chilli red** as the single accent, used for actions and emphasis
- **Warm sand** for quiet emphasis (badges, highlighted surfaces)
- `Fraunces` for headings, `Inter` for body text

All foreground/background pairs meet WCAG AA at normal text sizes.

## Roadmap

1. ~~Project foundation~~ ✅
2. ~~Design system (reusable UI components)~~ ✅ — review at `/design`
3. ~~Site layout (header, navigation, footer, mobile nav)~~ ✅
4. ~~Homepage sections~~ ✅
5. Shop, categories, product detail, cart, checkout

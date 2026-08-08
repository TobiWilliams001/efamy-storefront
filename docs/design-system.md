# Design system

The visual language of the Efamy storefront. Everything here is implemented —
this describes what the code does, not an aspiration.

Tokens live in `src/app/globals.css`. Change them there and the whole site
follows.

## Principles

1. **The products carry the colour.** Every label is a different loud colour, so
   the interface is a warm neutral canvas that lets them shout. Roughly 70%
   neutral, 20% photography, 10% accent.
2. **Trust before persuasion.** Allergens, ingredients, sizes and prices appear
   early and plainly. Nothing is claimed that is not on the jar.
3. **Mobile-first.** Every interactive target is at least 44px. The buy button
   follows you down the product page.
4. **Calm over decoration.** No gradients on text, no parallax, no autoplay.
   Motion is 200–300ms, and respects `prefers-reduced-motion`.

## Colour

Sampled from the logo, not invented alongside it.

### Core

| Token                | Value     | Use                             |
| -------------------- | --------- | ------------------------------- |
| `--background`       | `#FAF8F3` | Warm ivory page canvas          |
| `--card`             | `#FFFFFF` | Cards, forms, elevated surfaces |
| `--foreground`       | `#242424` | Charcoal body text              |
| `--muted-foreground` | `#676159` | Secondary text, 5.77:1          |
| `--border`           | `#E5E0D8` | Hairlines                       |

### Brand

| Token                   | Value                 | Use                                                                   |
| ----------------------- | --------------------- | --------------------------------------------------------------------- |
| `--brand-bright`        | `#FC0D13`             | The logo scarlet. **Decorative only** — 3.80:1, fails as text         |
| `--brand`               | `#8B2D2D`             | Burgundy. Actions, prices, heat. 7.88:1 text, 8.36:1 with white on it |
| `--brand-hover`         | `#B00810`             | Button hover                                                          |
| `--gold`                | `#CB9954`             | The logo tan. **Fills only** — 2.41:1                                 |
| `--gold-ink`            | `#96682C`             | Icons and labels on ivory, 4.59:1                                     |
| `--sage` / `--sage-ink` | `#758C5B` / `#66794E` | Dietary badges, success                                               |
| `--clay`                | `#E3CEB0`             | Feature bands, chips                                                  |
| `--ink`                 | `#4A1414`             | Deep maroon. Footer and statement headers                             |

**The two-tier rule.** The true logo colours are too light to carry text. Each
has an accessible sibling one step deeper in the same family. Use `--gold` for a
fill and `--gold-ink` the moment it becomes a letterform.

### Product accents

Per-product colours drawn from the jar labels, used for the band across the top
of each card and nothing else. Defined in `src/lib/product-accent.ts`.

| Beans     | Beef      | Chicken   | Fish      | Pork      | Seasonings | Coat & Cook |
| --------- | --------- | --------- | --------- | --------- | ---------- | ----------- |
| `#556B2F` | `#8D5446` | `#E58D43` | `#8DBF3C` | `#C34B6A` | `#C89B3C`  | `#294D96`   |

Never a page background. They are identification, not decoration.

### Neutral scale

`#FAF8F3` `#F3F0EA` `#E5E0D8` `#D5CEC3` `#B5ADA1` `#8B847A` `#676159` `#4C4742`
`#302D2A` `#1C1A18` (50 → 900)

## Typography

**DM Serif Display** for headings, **Manrope** for body. Both self-hosted via
`next/font`, so there is no layout shift and no third-party request.

| Level   | Size                                    | Notes                     |
| ------- | --------------------------------------- | ------------------------- |
| H1      | `text-4xl` → `text-[3.25rem]`           | One per page              |
| H2      | `text-3xl` → `text-[2.75rem]`           | Section headings          |
| H3      | `text-xl` – `text-2xl`                  | Card and block titles     |
| Body    | `text-base`                             | `text-lg` for intros      |
| Small   | `text-sm`                               | Metadata, captions        |
| Eyebrow | `text-xs`, `0.18em` tracking, uppercase | Always paired with a rule |

DM Serif Display ships **one weight**. Headings are pinned to 400 — asking for
bold makes the browser synthesise it, which smears at display sizes.

Prices and quantities carry `data-numeric`, which applies tabular figures so
columns do not jitter.

## Spacing

An 8px system. Section rhythm is 72 / 96 / 120px at mobile / tablet / desktop,
applied by `<Section>` so no page decides its own vertical spacing.

Cards use 20–24px padding. Containers: 720px prose, 1280px default.

## Radius and elevation

8 / 12 / 16 / 24px. Cards use 16px.

One shadow: `0 10px 30px rgba(0,0,0,.08)`, with a slightly deeper hover. Soft,
never harsh — cards should feel lifted, not floating.

## Buttons

| Variant   | Appearance                      | Use                                       |
| --------- | ------------------------------- | ----------------------------------------- |
| `default` | Charcoal, white text            | Most actions                              |
| `accent`  | Burgundy, white text            | **One per view.** Add to basket, checkout |
| `outline` | Card background, neutral border | Secondary                                 |
| `ghost`   | Transparent                     | Icon buttons, tertiary                    |

Sizes run `xs` to `xl`. **`xl` is 44px** and is the minimum for any primary
action — the shadcn registry tops out below the touch-target threshold, so `xl`
was added.

States: hover darkens, `focus-visible` shows a 3px ring, disabled drops to 50%
opacity and removes pointer events.

## Components

**Product card** — accent band, square cut-out on a white-to-neutral gradient,
name, heat as a coloured line, summary, dietary and allergen chips, price
(`from £x` when there are sizes), size count, and an add button. Single-size
products add straight from the grid; multi-size link to the page rather than
guessing.

**Page header** — every inner page opens with an eyebrow rule, title, gold
divider and optional description. `warm` (clay gradient) or `ink` (maroon).

**Forms** — 44px inputs, labels always visible, errors below the field in
`--destructive` with `aria-invalid`. Never placeholder-as-label.

**Icons** — Lucide, outline only, 1.5–1.75 stroke, `size-4` inline and `size-5`
standalone. Decorative icons are `aria-hidden`.

## Accessibility

Every foreground/background pair meets **WCAG AA**, verified by measuring rather
than eyeballing:

| Pair                    | Ratio   |
| ----------------------- | ------- |
| Body on ivory           | 14.63:1 |
| Muted on ivory          | 5.77:1  |
| Price / brand on ivory  | 7.88:1  |
| White on accent button  | 8.36:1  |
| Gold-ink icons on ivory | 4.59:1  |
| Gold headings on maroon | 5.87:1  |

Also: semantic landmarks, one `h1` per page, a skip link, visible focus rings,
`prefers-reduced-motion` honoured, and alt text describing the product rather
than the photograph.

## Performance

AVIF then WebP via `next/image`, sized to a 1280px maximum so no oversized
variants are generated. Above-the-fold images load eagerly with
`fetchPriority="high"`; the hero is the only `preload`. Everything else is lazy.

`quality` overrides are avoided — Next 16 restricts qualities to `[75]` and
returns 400 for anything else.

## Deliberate omissions

- **No dark mode.** Photography-led, and a single warm theme keeps the jars
  consistent.
- **No decorative patterns.** The brief the client approved rules out heavy
  patterns and supermarket brightness.
- **No autoplay video or scroll animation.** Motion serves usability only.

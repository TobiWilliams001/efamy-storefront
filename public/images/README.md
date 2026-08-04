# Product imagery

Save the client's photographs here using exactly these filenames — the
catalogue in `src/lib/catalogue-data.ts` references them by path.

Anything missing renders as a broken image. Nothing here is committed yet.

## `products/` — packshots on white

| Filename                                 | Which photograph                                                    |
| ---------------------------------------- | ------------------------------------------------------------------- |
| `beans-chilli-sauce-mild.jpg`            | Large jar, dark green label, white lid, "Beans Chilli Sauce — Mild" |
| `beef-chilli-sauce-mild.jpg`             | Tall round jar, burgundy label, gold lid, "Beef — Mild"             |
| `beef-chilli-sauce-hot.jpg`              | Square jar, burgundy label, gold lid, "Beef — Hot"                  |
| `beef-chilli-sauce-hot-250g.jpg`         | Round jar, burgundy premium label with cow line-drawing, 250g       |
| `chicken-chilli-sauce-hot.jpg`           | Square jar, orange label, gold lid, "Chicken — Hot"                 |
| `chicken-chilli-sauce-hot-250g.jpg`      | Round jar, orange premium label with cockerel line-drawing, 250g    |
| `fish-chilli-sauce-mild.jpg`             | Round jar, green label with orange ring, "Fish — Mild"              |
| `fish-chilli-sauce-hot.jpg`              | Square jar, green label, silver lid, "Fish — Hot"                   |
| `fish-chilli-sauce-hot-large.jpg`        | Taller round jar, green label, gold lid, "Fish — Hot"               |
| `pork-chilli-sauce-hot.jpg`              | Large jar, pink/magenta label, white lid, "Pork Chilli Sauce — Hot" |
| `all-purpose-seasoning-mix.jpg`          | Yellow-labelled seasoning jars (the 8-jar case shot)                |
| `all-purpose-seasoning-sample-pouch.jpg` | Clear "Free Sample" pouch, yellow and red label                     |
| `kelewele-seasoning-mix.jpg`             | Orange bottles with red caps in cardboard trays                     |
| `coat-and-cook.jpg`                      | Navy-labelled jar, "Coat & Cook", 250g                              |

## `lifestyle/` — styled shots

| Filename                               | Which photograph                                                   |
| -------------------------------------- | ------------------------------------------------------------------ |
| `hero-hot-sauce-trio.jpg`              | Wide banner: pork, beef and chicken hot sauces on a marble worktop |
| `chicken-chilli-sauce-hot-kitchen.jpg` | Chicken hot sauce on a board with chillies, garlic and ginger      |

## `brand/`

Currently unused. Reserved for the logo and any Open Graph share image.

## Not yet used

The full-range group shot (six products together) and the wide styled chicken
banner have no home in the current pages. Both would suit an About page or a
category header — add them when those pages exist.

## Before adding

- Keep the white-background packshots square-ish or portrait; cards crop to 4:5.
- Compress before committing. These are large photographs and every one ships
  to the browser via `next/image`.
- Check the dimensions in `catalogue-data.ts` match the files you add, or the
  reserved space will be slightly wrong and cause layout shift.

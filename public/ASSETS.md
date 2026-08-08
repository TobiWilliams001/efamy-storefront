# Brand assets

Everything in `public/` is served publicly and uploaded on **every deploy**.
Keep working files, raw exports and anything the website does not render out of
this directory — put those in shared storage instead.

```
products/
  cutout/         Background-removed packshots. Used by the catalogue.
  hero/           Wide crops for page headers.
  collections/    Group and range shots.
dishes/           Square photos for the meal pairings row.
logos/            The wordmark, light and dark.
```

## In use

| Path                                    | Used by                    |
| --------------------------------------- | -------------------------- |
| `products/cutout/*.png`                 | Product cards and detail   |
| `products/hero/hero-hot-sauce-trio.jpg` | Homepage hero, social card |
| `products/collections/range-lineup.jpg` | About page                 |
| `dishes/*.jpg`                          | Meal pairings row          |
| `logos/*.png`                           | Header and footer          |

Originals and superseded files live in `assets/` at the repo root, outside
`public/`, so they are kept without being deployed.

Filenames are referenced directly from `src/lib/catalogue-data.ts`. Renaming a
file without updating that file breaks the image.

## Still needed

- **Dish photography** — six of the nine meal tiles still fall back to a warm
  swatch. Square, cropped tight on the plate.
- **Recipe photography** — every recipe page currently shows a coloured swatch.
- **Logo files** (`logos/`) — the wordmark is set in type today, not an asset.
- **Open Graph share image** — nothing is set, so links shared to WhatsApp or
  social currently preview without an image.

## Conventions

- Cut-outs are PNG, because JPEG has no alpha channel. `next/image` re-encodes
  to WebP/AVIF per request, so the origin size affects repo and build time
  rather than what visitors download.
- Photographs with no transparency should be JPEG, longest edge ~1400px.
- Name by product slug so the link to `catalogue-data.ts` stays obvious.
- Video does not belong in `public/` once files get large. A 13 MB hero video
  would be uploaded on every deploy and cannot be streamed adaptively; host it
  on a video service and embed instead.

# Brand assets

Everything in `public/` is served publicly and uploaded on **every deploy**.
Keep working files, raw exports and anything the website does not render out of
this directory — put those in shared storage instead.

```
products/
  white/          Packshots on white. Used by the catalogue.
  transparent/    Cut-outs (PNG with alpha), for overlays and composites.
  lifestyle/      Products in use — cooking, table scenes.
  hero/           Wide crops for page headers.
  collections/    Group and range shots.
social/
  square/ story/ reels/ banners/
videos/
  hero/ product/ reels/
logos/
icons/
packaging/
recipes/
ingredients/
```

## In use

| Path                                               | Used by                     |
| -------------------------------------------------- | --------------------------- |
| `products/white/*.jpg`                             | Product cards and detail    |
| `products/white/chicken-chilli-sauce-hot-250g.jpg` | Chilli Sauces category card |
| `products/white/all-purpose-seasoning-mix.jpg`     | Seasonings category card    |
| `products/collections/range-lineup.jpg`            | Homepage hero               |

Filenames are referenced directly from `src/lib/catalogue-data.ts`. Renaming a
file without updating that file breaks the image.

## Still needed

- **Lifestyle photography** (`products/lifestyle/`, `products/hero/`) — the
  styled kitchen and worktop shots. The homepage hero currently uses the range
  packshot; a proper wide lifestyle crop would suit it better.
- **Logo files** (`logos/`) — the wordmark is set in type today, not an asset.
- **Open Graph share image** — nothing is set, so links shared to WhatsApp or
  social currently preview without an image.

## Conventions

- Packshots: JPEG, longest edge ~1400px, quality ~82. The source PNGs were
  1–2 MB each; converting cut the set from 25 MB to 4.5 MB. `next/image` still
  re-encodes to WebP/AVIF per request, but the origin file size affects repo
  size and build time.
- Cut-outs stay PNG — JPEG has no alpha channel.
- Name by product slug so the link to `catalogue-data.ts` stays obvious.
- Video does not belong in `public/` once files get large. A 13 MB hero video
  would be uploaded on every deploy and cannot be streamed adaptively; host it
  on a video service and embed instead.

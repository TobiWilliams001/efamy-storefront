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

## The unsorted drop in `public/` root

Twenty-four files sit unrenamed in `public/` root, gitignored by the
`ChatGPT Image*` and `WhatsApp Image*` rules. They are not deployed, and a fresh
clone will not have them. **Both sets are photographs of real Efamy jars.**

- **`WhatsApp Image *.jpeg`** — the client's own photographs, sent over
  WhatsApp. These are the source material.
- **`ChatGPT Image *.png`** — the same real jars with the background removed.
  The filename is misleading: the tool was used to cut out a photograph, not to
  generate food. Nothing on this site is an invented product image, and nothing
  should be.

Files move into `products/cutout/` under their product slug once the label has
been read and matched to a product.

### Reading the labels

The label text is the only reliable way to tell these apart — several jars
differ only in a word on the front. The chilli oils and the Goat sauce were
identified by OCR, not by eye:

```bash
python3 -m venv ocr && ocr/bin/pip install pyobjc-framework-Vision   # ~30s
ocr/bin/python ocr.py "public/WhatsApp Image ....jpeg"               # macOS Vision
```

Build it in a scratch directory, not in the repo. Any OCR that reads a
photograph will do; the point is to read the label rather than guess from
colour.

### When OCR fails, look

`products/cutout/turkey-chilli-sauce.png` was matched on lid and label colour
alone, because OCR could not read the flavour off the decorative script. It has
since been **confirmed correct by eye**: the label reads "Turkey Chilli Sauce"
over "Hot", which matches the single hot variant in the catalogue.

The lesson is that the script defeats OCR but not a person. Where OCR returns
nothing, open the image and read it before filing the file — never fall back to
matching on colour, which is a guess dressed up as a match.

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

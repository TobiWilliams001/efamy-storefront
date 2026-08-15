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
photos/           Efamy's own kitchen and stockroom. Evidence, not styling.
logos/            The wordmark, light and dark.
```

## In use

| Path                                    | Used by                    |
| --------------------------------------- | -------------------------- |
| `products/cutout/*.png`                 | Product cards and detail   |
| `products/hero/hero-hot-sauce-trio.jpg` | Homepage hero, social card |
| `products/collections/range-lineup.jpg` | About page                 |
| `dishes/*.jpg`                          | Meal pairings row          |
| `photos/filling-jars.jpg`               | "Why choose Efamy" panel   |
| `photos/cooking-pots.jpg`               | About, "Where it is made"  |
| `photos/finished-trays.jpg`             | About, "Where it is made"  |
| `photos/stockroom.jpg`                  | About, "Where it is made"  |
| `logos/*.png`                           | Header and footer          |

`photos/bottling-chilli-oil.jpg`, `photos/jars-lined-up.jpg`,
`photos/mixing.jpg` and `photos/production-room.jpg` are filed and unused —
kept because they are real and cost nothing to hold, ready for a page that
needs them.

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

### Three files nothing uses, on purpose

Three of the WhatsApp photographs are raw ingredients cut out on white: a salmon
steak, two beef steaks, and a whole uncooked chicken. They match the Fish, Beef
and Chicken sauces, so the temptation is to use them as ingredient imagery.

They are not filed and nothing points at them, for three reasons:

- They do not look like Efamy's photography. Everything else in the drop is a
  phone photograph of their kitchen; these are evenly lit studio cut-outs with
  upscaling artefacts around the edges, which is what a stock library or an
  image search produces.
- **Provenance is unknown.** Serving an image the business does not hold a
  licence for is the risk `unlicensed-assets/` exists to contain, and a food
  brand is an easy target for it.
- Raw meat is not appetising on a storefront. The site is selling dinner.

**Ask the client where these came from before anything uses them.** If they were
bought or shot for Efamy, they can move into `photos/`; if they came off the
internet, they belong in `unlicensed-assets/`.

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

- **Dish photography** — four of the nine meal tiles still fall back to a warm
  swatch: Kenkey & Fish, Jollof Rice, Waakye, and Yam & Plantain. Square,
  cropped tight on the plate. Efamy's photographs covered their premises well
  and their cooking barely at all, so this gap is unchanged by the drop.
- **Recipe photography** — five of the six recipes still show a coloured
  swatch. Only Coat & Cook Chicken has a photograph.
- **A single jar of All Purpose Seasoning** — it currently shows a tray of
  about eight jars, which sits oddly beside the single-jar sauces.
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

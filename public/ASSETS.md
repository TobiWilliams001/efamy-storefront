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

Nothing in `public/` is unreferenced. The client cut the whole "Where it is
made" strip from About and the shelf photograph from Stockists; all eight
kitchen and stockroom photographs are in `assets/source/premises/`, in git and
out of the build.

Originals and superseded files live in `assets/` at the repo root, outside
`public/`, so they are kept without being deployed. A photograph that comes
off a page goes there rather than into the bin: `assets/source/premises/`
holds Efamy's own kitchen photographs, and `assets/source/superseded-cutouts/`
the jars that have been replaced. Both are in git; neither ships.

## The source drop in `photos-src/`

Everything the client sent lives in `photos-src/`, named for what it shows. The
whole folder is gitignored, so it is neither committed nor deployed and a fresh
clone will not have it. **Every file in it is a photograph of something real.**

```
photos-src/
  client-photos/        Efamy's own photographs, readable copies
  product-cutouts/      the same jars with the background removed
  unreadable-originals/ see "Files macOS will not let you open" below
```

The `product-cutouts/` filenames used to read `ChatGPT Image ....png`, which was
misleading: the tool was used to cut a background off a photograph, not to
generate food. Nothing on this site is an invented product image, and nothing
should be. All twelve are already filed under `products/`, and two of them
(`turkey-chilli-sauce-duplicate.png`, `beef-chilli-oil-duplicate.png`) are
byte-identical repeats of their pair.

Files move into `products/cutout/` or `dishes/` under a real name
once the label has been read and matched.

### Files macOS will not let you open

The original WhatsApp files carry a provenance attribute that denies read access
to any process other than the app that wrote them. `cp`, `node`, `python3` and
the dev server all get `EPERM` on them, while files beside them open normally.

Copying them in Finder produces readable duplicates without the attribute, which
is what `client-photos/` holds. The originals are kept in
`unreadable-originals/` because they can still be moved and renamed — `mv` needs
directory permission, not read permission — and Finder can still copy them
again if a copy is ever lost.

### Reading the labels

The label text is the only reliable way to tell these apart — several jars
differ only in a word on the front. The chilli oils and the Goat sauce were
identified by OCR, not by eye:

```bash
python3 -m venv ocr && ocr/bin/pip install pyobjc-framework-Vision   # ~30s
ocr/bin/python ocr.py public/photos-src/product-cutouts/*.png        # macOS Vision
```

Build it in a scratch directory, not in the repo. Any OCR that reads a
photograph will do; the point is to read the label rather than guess from
colour.

Vision also returns a bounding box per line, which answers "how many jars are in
this photograph" without opening it: the All Purpose packshot returns the same
label eight times, in four columns across two rows.

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
bought or shot for Efamy, they can be filed under `products/`; if they came off the
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

- **Licensing for the dish photographs.** Every meal tile and every recipe now
  carries a real photograph, and the swatch fallback no longer fires anywhere.
  Several were sourced from Pinterest rather than shot for Efamy. Not
  AI-generated is not the same as licensed to publish, and a food brand using
  another photographer's work is an easy complaint to receive. **Confirm where
  each came from, or replace them with photographs Efamy owns.** The same rule
  that keeps `unlicensed-assets/` out of the build applies here.
- **Logo files** (`logos/`) — the wordmark is set in type today, not an asset.
- **Open Graph share image** — the homepage hero stands in for one. A shot
  framed for a 1200x630 share card would read better in a WhatsApp preview.

## Conventions

- Cut-outs are PNG, because JPEG has no alpha channel. `next/image` re-encodes
  to WebP/AVIF per request, so the origin size affects repo and build time
  rather than what visitors download.
- Photographs with no transparency should be JPEG, longest edge ~1400px.
- Name by product slug so the link to `catalogue-data.ts` stays obvious.
- Video does not belong in `public/` once files get large. A 13 MB hero video
  would be uploaded on every deploy and cannot be streamed adaptively; host it
  on a video service and embed instead.

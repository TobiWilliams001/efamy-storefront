# Dish photography

Square-ish photos of meals these sauces belong with. Used by the "Perfect with
every meal" row on the homepage, which falls back to a warm swatch for any dish
without an image here.

Filenames must match the `image` paths in `src/lib/dishes.ts`.

| Filename              | Dish             |
| --------------------- | ---------------- |
| `spaghetti.jpg`       | Spaghetti        |
| `kenkey-fish.jpg`     | Kenkey & Fish    |
| `jollof-rice.jpg`     | Jollof Rice      |
| `fried-chicken.jpg`   | Fried Chicken    |
| `waakye.jpg`          | Waakye           |
| `fried-fish-yam.jpg`  | Fried Fish & Yam |
| `kelewele.jpg`        | Kelewele         |
| `rice-stew.jpg`       | Rice & Stew      |

Every tile has a photograph, so the swatch fallback no longer fires. It stays
in the code because a tile added without one should degrade rather than break.

A tile is named after the photograph, never the other way round. The row used to
carry a "Grilled Chicken" tile with no photograph behind it; it is now Fried
Chicken, because a photograph of Efamy's own fried chicken is what exists. Do
not point a tile at a photograph of a different dish to fill the gap.

## Before adding

- **Crop square, tight on the plate.** The tiles are circular, so anything
  outside the plate is cropped away anyway and a loose crop wastes resolution.
- 600px square is plenty; these render at ~112px.
- Compress. Phone photos are several MB and every one ships to the browser.
- Avoid strongly coloured backgrounds or tablecloths. The site sits on warm
  ivory, and a saturated backdrop fights both the palette and the jars.

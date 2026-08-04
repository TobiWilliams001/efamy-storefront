# Dish photography

Square-ish photos of meals these sauces belong with. Used by the "Perfect with
every meal" row on the homepage, which falls back to a warm swatch for any dish
without an image here.

Filenames must match the `image` paths in `src/lib/dishes.ts`.

| Filename              | Dish            |
| --------------------- | --------------- |
| `spaghetti.jpg`       | Spaghetti       |
| `kenkey-fish.jpg`     | Kenkey & Fish   |
| `jollof-rice.jpg`     | Jollof Rice     |
| `grilled-chicken.jpg` | Grilled Chicken |
| `waakye.jpg`          | Waakye          |
| `yam-plantain.jpg`    | Yam & Plantain  |
| `kelewele.jpg`        | Kelewele        |
| `rice-stew.jpg`       | Rice & Stew     |

## Before adding

- **Crop square, tight on the plate.** The tiles are circular, so anything
  outside the plate is cropped away anyway and a loose crop wastes resolution.
- 600px square is plenty; these render at ~112px.
- Compress. Phone photos are several MB and every one ships to the browser.
- Avoid strongly coloured backgrounds or tablecloths. The site sits on warm
  ivory, and a saturated backdrop fights both the palette and the jars.

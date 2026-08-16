export type Dish = {
  name: string;
  /** Drop a square photo into public/dishes and point at it here. */
  image?: string;
};

/**
 * The meals people actually cook with these sauces, so a visitor can see where
 * a jar fits before they read a word. Each tile falls back to a warm swatch
 * until an image is set.
 *
 * A tile is named after the photograph that exists, never the other way round.
 * Fried chicken is here because Efamy sent a photograph of theirs; the empty
 * tiles stay empty until a real photograph of that dish arrives.
 */
export const dishes: Dish[] = [
  { name: "Spaghetti", image: "/dishes/spaghetti.jpg" },
  { name: "Kenkey & Fish" },
  { name: "Jollof Rice", image: "/dishes/jollof-rice.jpg" },
  { name: "Fried Chicken", image: "/dishes/fried-chicken.jpg" },
  { name: "Waakye", image: "/dishes/waakye.jpg" },
  { name: "Yam & Plantain" },
  { name: "Kelewele", image: "/dishes/kelewele.jpg" },
  { name: "Rice & Stew", image: "/dishes/rice-stew.jpg" },
  { name: "Fried Eggs" },
];

export type Dish = {
  name: string;
  /** Drop a square photo into public/dishes and point at it here. */
  image?: string;
};

/**
 * The meals people actually cook with these sauces, so a visitor can see where
 * a jar fits before they read a word. Photography is still to come; each tile
 * falls back to a warm swatch until an image is set.
 */
export const dishes: Dish[] = [
  { name: "Spaghetti", image: "/dishes/spaghetti.jpg" },
  { name: "Kenkey & Fish" },
  { name: "Jollof Rice" },
  { name: "Grilled Chicken" },
  { name: "Waakye" },
  { name: "Yam & Plantain" },
  { name: "Kelewele", image: "/dishes/kelewele.jpg" },
  { name: "Rice & Stew" },
  { name: "Fried Eggs" },
];

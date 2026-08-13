export type Recipe = {
  slug: string;
  title: string;
  /** One line for cards and search results. */
  summary: string;
  /** Slug of the Efamy product this dish is built around. */
  productSlug: string;
  serves: number;
  /** Minutes. Rendered as ISO 8601 durations for structured data. */
  prepMinutes: number;
  cookMinutes: number;
  ingredients: string[];
  method: string[];
  /** Square photo in public/recipes. Falls back to a warm swatch. */
  image?: string;
};

/**
 * DRAFT CONTENT. These are ordinary versions of well-known dishes, written so
 * the pages and structured data can be built and reviewed. They are not the
 * client's recipes and must be replaced or approved before launch — a food
 * brand publishing recipes it did not write is a credibility problem, not just
 * an editorial one.
 */
export const recipes: Recipe[] = [
  {
    slug: "jollof-rice",
    title: "Jollof Rice",
    summary: "The Sunday staple, finished with a spoon of beef chilli sauce.",
    productSlug: "beef-chilli-sauce-hot",
    serves: 4,
    prepMinutes: 15,
    cookMinutes: 45,
    ingredients: [
      "400g long grain rice, rinsed until the water runs clear",
      "2 tbsp Efamy Beef Chilli Sauce, plus more to serve",
      "1 tin chopped tomatoes",
      "2 red onions, one blended and one sliced",
      "1 red pepper, blended",
      "3 tbsp vegetable oil",
      "500ml stock",
      "1 bay leaf",
      "Salt to taste",
    ],
    method: [
      "Blend one onion with the red pepper until smooth.",
      "Heat the oil in a heavy pan and fry the sliced onion until soft and golden.",
      "Add the blended mixture and cook down for 10 minutes, stirring, until it darkens and the raw smell goes.",
      "Stir in the tomatoes and the chilli sauce. Cook for another 10 minutes until thick.",
      "Add the rice and turn it through the sauce so every grain is coated.",
      "Pour in the stock, add the bay leaf, season, and bring to a simmer.",
      "Cover tightly and cook on the lowest heat for 25 to 30 minutes without lifting the lid.",
      "Rest off the heat for 5 minutes, fluff with a fork, and serve with more chilli sauce alongside.",
    ],
  },
  {
    slug: "kelewele",
    title: "Kelewele",
    summary: "Spiced fried plantain, sweet and hot at once.",
    productSlug: "kelewele-seasoning-mix",
    serves: 4,
    prepMinutes: 10,
    cookMinutes: 15,
    ingredients: [
      "4 ripe plantains, skins well spotted",
      "2 tbsp Efamy Kelewele Seasoning Mix",
      "1 tbsp water",
      "Vegetable oil for frying",
      "Salt to taste",
    ],
    method: [
      "Peel the plantains and cut into thick diagonal slices or cubes.",
      "Mix the seasoning with the water to a loose paste.",
      "Toss the plantain through the paste until evenly coated. Leave for 10 minutes.",
      "Heat oil in a deep pan to a medium-high heat.",
      "Fry in batches for 3 to 4 minutes a side until deep gold and caught at the edges.",
      "Drain on kitchen paper, season, and eat hot.",
    ],
  },
  {
    slug: "grilled-chicken",
    title: "Grilled Chicken",
    summary: "All Purpose Seasoning under the skin, chilli sauce over the top.",
    productSlug: "all-purpose-seasoning-mix",
    serves: 4,
    prepMinutes: 15,
    cookMinutes: 35,
    ingredients: [
      "8 chicken thighs, bone in and skin on",
      "2 tbsp Efamy All Purpose Seasoning Mix",
      "2 tbsp Efamy Chicken Chilli Sauce, to serve",
      "1 onion, sliced",
      "2 tbsp oil",
      "1 lemon",
    ],
    method: [
      "Loosen the skin on each thigh and work the seasoning underneath as well as over.",
      "Toss with the oil and sliced onion and leave for at least 30 minutes, or overnight in the fridge.",
      "Heat the oven to 200C fan.",
      "Roast skin side up for 30 to 35 minutes until the skin is crisp and the juices run clear.",
      "Squeeze over the lemon and serve with the chilli sauce spooned alongside.",
    ],
  },
  {
    slug: "waakye",
    title: "Waakye",
    summary: "Rice and beans, and the sauce that belongs with it.",
    productSlug: "beans-chilli-sauce-mild",
    serves: 6,
    prepMinutes: 20,
    cookMinutes: 60,
    ingredients: [
      "300g black eyed beans, soaked overnight",
      "400g long grain rice, rinsed",
      "Waakye leaves or a pinch of bicarbonate of soda",
      "Efamy Beans Chilli Sauce, to serve",
      "Salt to taste",
    ],
    method: [
      "Boil the drained beans with the waakye leaves in plenty of water for about 40 minutes, until tender but holding shape.",
      "Remove the leaves. The water should be a deep red.",
      "Add the rice to the pan with the beans and their liquid, topping up so the water sits about 2cm above.",
      "Season, bring back to a simmer, then cover and cook on low for 20 to 25 minutes until the liquid is gone.",
      "Rest for 5 minutes, fork through, and serve with the chilli sauce.",
    ],
  },
  {
    slug: "fried-fish-and-yam",
    title: "Fried Fish & Yam",
    summary: "Crisp yam, fried fish, and fish chilli sauce to dip.",
    productSlug: "fish-chilli-sauce-hot",
    serves: 4,
    prepMinutes: 20,
    cookMinutes: 25,
    ingredients: [
      "1 medium yam, peeled and cut into thick chips",
      "4 whole tilapia or sea bream, cleaned and scored",
      "2 tbsp Efamy All Purpose Seasoning Mix",
      "Efamy Fish Chilli Sauce, to serve",
      "Vegetable oil for frying",
      "Salt",
    ],
    method: [
      "Boil the yam in salted water for 8 minutes, then drain and steam dry.",
      "Rub the seasoning into the fish, working it into the scores.",
      "Heat oil in a deep pan to a medium-high heat.",
      "Fry the fish for 5 to 6 minutes a side until the skin is crisp and it lifts cleanly from the pan.",
      "Fry the yam in the same oil until golden at the edges.",
      "Serve together with the chilli sauce for dipping.",
    ],
  },
  {
    slug: "coat-and-cook-chicken",
    title: "Coat & Cook Chicken",
    summary: "A crisp coating with nothing more than a bowl and a pan.",
    productSlug: "coat-and-cook",
    serves: 4,
    prepMinutes: 10,
    cookMinutes: 20,
    ingredients: [
      "8 chicken drumsticks or thighs",
      "150g Efamy Coat & Cook",
      "2 eggs, beaten",
      "Vegetable oil for frying",
      "Efamy Chicken Chilli Sauce, to serve",
    ],
    method: [
      "Pat the chicken dry. Wet meat will not hold a coating.",
      "Dip each piece in the beaten egg, then press firmly into the Coat & Cook until fully covered.",
      "Rest the coated pieces for 10 minutes so the crust sets.",
      "Heat oil in a deep pan to a medium heat, no hotter, or the coating colours before the chicken cooks.",
      "Fry for 12 to 15 minutes, turning, until deep gold and cooked through.",
      "Drain and serve with the chilli sauce.",
    ],
  },
];

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.slug === slug);
}

/** Minutes to the ISO 8601 duration schema.org expects. */
export function isoDuration(minutes: number): string {
  return `PT${minutes}M`;
}

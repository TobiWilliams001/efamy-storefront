import type { Product, ProductCategory, ProductVariant } from "@/types/product";

/**
 * Prices come from the client's price list (singles only; 6/12/24-packs are
 * trade and handled through wholesale enquiries).
 *
 * Ingredients and allergens are transcribed only where the label was legible.
 * Anything unreadable is left out rather than guessed, because getting food
 * allergen data wrong is a safety and legal issue.
 */

const STORAGE_SAUCE =
  "Store in a cool, dry place. Refrigerate after opening and use within 4 weeks.";
const STORAGE_DRY =
  "Store in a cool, dry place. Keep the container sealed after use.";

/** Sauce sizes and prices in pence, keyed by the protein on the price list. */
function sauceVariants(
  p175: number,
  p250: number,
  p500: number,
  p800: number,
): ProductVariant[] {
  return [
    { size: "175g", price: p175, inStock: true },
    { size: "250g", price: p250, inStock: true },
    { size: "500g", price: p500, inStock: true },
    { size: "800g", price: p800, inStock: true },
  ];
}

const BEANS = () => sauceVariants(275, 425, 825, 1150);
const MEAT = () => sauceVariants(325, 475, 875, 1250);

function single(size: string, price: number): ProductVariant[] {
  return [{ size, price, inStock: true }];
}

export const categories: ProductCategory[] = [
  {
    id: "cat-chilli-sauces",
    slug: "chilli-sauces",
    name: "Chilli Sauces",
    description:
      "Chilli sauces in beans, beef, chicken, fish and pork, with real meat and fish chunks you can see.",
    image: {
      url: "/products/cutout/chicken-chilli-sauce-hot.png",
      alt: "Jar of Efamy chicken chilli sauce, hot",
      width: 631,
      height: 900,
    },
    productCount: 7,
  },
  {
    id: "cat-seasonings",
    slug: "seasonings",
    name: "Seasonings",
    description:
      "All Purpose Seasoning Mix, Kelewele Seasoning Mix and Coat & Cook for everyday cooking.",
    image: {
      url: "/products/cutout/all-purpose-seasoning-mix.png",
      alt: "Jars of Efamy all purpose seasoning mix",
      width: 775,
      height: 900,
    },
    productCount: 3,
  },
];

const category = {
  sauces: { slug: "chilli-sauces", name: "Chilli Sauces" },
  seasonings: { slug: "seasonings", name: "Seasonings" },
} as const;

export const products: Product[] = [
  {
    id: "beans-chilli-sauce-mild",
    slug: "beans-chilli-sauce-mild",
    name: "Beans Chilli Sauce, Mild",
    variants: BEANS(),
    summary:
      "Red kidney beans and green lentils in a gentle chilli sauce. Vegan.",
    description:
      "Red kidney beans and green lentils in a chilli sauce built on fresh ginger, garlic and onions. Mild, so the flavour comes through before the heat does.\n\nSpoon it over rice, stir it through pasta or couscous, or serve it alongside grilled vegetables. It is substantial enough to be the meal rather than the thing beside it.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    heat: "mild",
    dietary: ["Suitable for vegetarians", "Suitable for vegans"],
    image: {
      url: "/products/cutout/beans-chilli-sauce-mild.png",
      alt: "Jar of Efamy beans chilli sauce, mild, with a dark green label",
      width: 720,
      height: 900,
    },
    storage: STORAGE_SAUCE,
    servingSuggestions: ["Rice and stew", "Jollof", "Grilled vegetables"],
    category: category.sauces,
  },
  {
    id: "beef-chilli-sauce-mild",
    slug: "beef-chilli-sauce-mild",
    name: "Beef Chilli Sauce, Mild",
    variants: MEAT(),
    summary: "Chunks of real beef in a gentler chilli sauce.",
    description:
      "Real beef in pieces you can see, not a smooth paste. Fresh ginger, garlic and onions are the base, and the mild strength carries the same recipe as our hot jar with less chilli.\n\nThe one for a table where tastes differ. Good with rice and stew, jollof, or a plate of chips.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    heat: "mild",
    image: {
      url: "/products/cutout/beef-chilli-sauce-mild.png",
      alt: "Jar of Efamy beef chilli sauce, mild, with a burgundy label",
      width: 675,
      height: 900,
    },
    storage: STORAGE_SAUCE,
    servingSuggestions: [
      "Rice dishes",
      "Yam or plantain",
      "Sandwiches and wraps",
    ],
    category: category.sauces,
  },
  {
    id: "beef-chilli-sauce-hot",
    slug: "beef-chilli-sauce-hot",
    name: "Beef Chilli Sauce, Hot",
    variants: MEAT(),
    summary: "Chunks of real beef in a chilli sauce with a proper kick.",
    description:
      "Real beef in pieces you can see, not a smooth paste. Fresh ginger, garlic and onions are the base, and the hot strength is for cooks who already reach for chilli.\n\nSpoon it over rice, take it to a barbecue, or use it to lift a plate of chips or couscous.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    heat: "hot",
    dietary: ["No artificial preservatives"],
    image: {
      url: "/products/cutout/beef-chilli-sauce-hot.png",
      alt: "Jar of Efamy beef chilli sauce, hot",
      width: 728,
      height: 900,
    },
    images: [
      {
        url: "/products/cutout/beef-chilli-sauce-hot.png",
        alt: "Square jar of Efamy beef chilli sauce, hot",
        width: 675,
        height: 900,
      },
    ],
    storage: STORAGE_SAUCE,
    servingSuggestions: ["Jollof rice", "Grilled meat", "Eggs on toast"],
    category: category.sauces,
  },
  {
    id: "chicken-chilli-sauce-hot",
    slug: "chicken-chilli-sauce-hot",
    name: "Chicken Chilli Sauce, Hot",
    variants: MEAT(),
    summary: "Chunks of real chicken in a chilli sauce with a proper kick.",
    description:
      "Real chicken in pieces you can see, cooked into a sauce built on fresh ginger, garlic and onions. The hot strength is for people who already cook with chilli.\n\nSpoon it over rice, stir it through pasta, or serve it with fried plantain and yam.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    heat: "hot",
    dietary: ["No artificial preservatives"],
    image: {
      url: "/products/cutout/chicken-chilli-sauce-hot.png",
      alt: "Jar of Efamy chicken chilli sauce, hot",
      width: 631,
      height: 900,
    },
    images: [
      {
        url: "/products/cutout/chicken-chilli-sauce-hot.png",
        alt: "Square jar of Efamy chicken chilli sauce, hot",
        width: 767,
        height: 900,
      },
    ],
    storage: STORAGE_SAUCE,
    servingSuggestions: ["Rice and chicken", "Wraps", "Fried plantain"],
    category: category.sauces,
  },
  {
    id: "fish-chilli-sauce-mild",
    slug: "fish-chilli-sauce-mild",
    name: "Fish Chilli Sauce, Mild",
    variants: MEAT(),
    summary: "Chunks of real fish in a gentler chilli sauce.",
    description:
      "Made mainly with barracuda, in pieces you can see rather than a smooth paste. Fresh ginger, garlic and onions carry it, and the mild strength lets the fish come through first.\n\nThe jar for kenkey and fish, for rice, or for a salad that needs something with backbone.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    heat: "mild",
    allergens: ["Fish"],
    image: {
      url: "/products/cutout/fish-chilli-sauce-mild.png",
      alt: "Jar of Efamy fish chilli sauce, mild, with a green label",
      width: 675,
      height: 900,
    },
    storage: STORAGE_SAUCE,
    servingSuggestions: ["Boiled yam", "Rice", "Grilled fish"],
    category: category.sauces,
  },
  {
    id: "fish-chilli-sauce-hot",
    slug: "fish-chilli-sauce-hot",
    name: "Fish Chilli Sauce, Hot",
    variants: MEAT(),
    summary: "Chunks of real fish in a chilli sauce with a proper kick.",
    description:
      "Made mainly with barracuda, in pieces you can see rather than a smooth paste. Fresh ginger, garlic and onions carry it, and the hot strength stands up to a full plate.\n\nThe jar for kenkey and fish, for waakye, or for rice that needs waking up.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    heat: "hot",
    allergens: ["Fish"],
    image: {
      url: "/products/cutout/fish-chilli-sauce-hot.png",
      alt: "Square jar of Efamy fish chilli sauce, hot, with a green label",
      width: 675,
      height: 900,
    },
    images: [
      {
        url: "/products/cutout/fish-chilli-sauce-hot-large.png",
        alt: "Large jar of Efamy fish chilli sauce, hot",
        width: 675,
        height: 900,
      },
    ],
    storage: STORAGE_SAUCE,
    servingSuggestions: ["Boiled yam", "Kenkey", "Grilled fish"],
    category: category.sauces,
  },
  {
    id: "pork-chilli-sauce-hot",
    slug: "pork-chilli-sauce-hot",
    name: "Pork Chilli Sauce, Hot",
    variants: MEAT(),
    summary: "Chunks of real pork in a chilli sauce with a proper kick.",
    description:
      "Real pork in pieces you can see, cooked into a sauce built on fresh ginger, garlic and onions. The hot strength is for people who already cook with chilli.\n\nGood over rice, with chips, or taken to a barbecue where it tends not to come home again.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    heat: "hot",
    ingredients: [
      "Onions",
      "Pork",
      "Chillies",
      "Oil",
      "Salt",
      "Sugar",
      "Garlic",
    ],
    dietary: ["No artificial preservatives"],
    image: {
      url: "/products/cutout/pork-chilli-sauce-hot.png",
      alt: "Jar of Efamy pork chilli sauce, hot, with a pink label",
      width: 793,
      height: 900,
    },
    storage: STORAGE_SAUCE,
    servingSuggestions: ["Rice", "Fried plantain", "Grilled pork"],
    category: category.sauces,
  },
  {
    id: "all-purpose-seasoning-mix",
    slug: "all-purpose-seasoning-mix",
    name: "All Purpose Seasoning Mix, Original",
    variants: single("300g", 475),
    summary: "One mix for meat, fish and chicken. Enhances natural flavour.",
    description:
      "An all purpose seasoning mix for beef, fish, chicken and more. No artificial preservatives.",
    dietary: ["No artificial preservatives"],
    image: {
      url: "/products/cutout/all-purpose-seasoning-mix.png",
      alt: "Jars of Efamy all purpose seasoning mix, original",
      width: 775,
      height: 900,
    },
    images: [
      {
        url: "/products/cutout/all-purpose-seasoning-sample-pouch.png",
        alt: "Free sample pouch of Efamy all purpose seasoning mix",
        width: 900,
        height: 675,
      },
    ],
    storage: STORAGE_DRY,
    servingSuggestions: ["Beef", "Fish", "Chicken"],
    category: category.seasonings,
  },
  {
    id: "kelewele-seasoning-mix",
    slug: "kelewele-seasoning-mix",
    name: "Kelewele Seasoning Mix",
    variants: single("150g", 325),
    summary: "The spice blend for kelewele, and for barbecues and kebabs.",
    description:
      "Spices, negro pepper, chilli powder and crushed chilli peppers — the blend we first made in December 2015.\n\nIts home is kelewele, spiced fried plantain, but it earns its place at a barbecue and on kebabs just as easily.\n\nMade in Corby. No colours, additives or preservatives.",
    image: {
      url: "/products/cutout/kelewele-seasoning-mix.png",
      alt: "Bottles of Efamy kelewele seasoning mix with red caps",
      width: 900,
      height: 506,
    },
    storage: STORAGE_DRY,
    servingSuggestions: ["Spiced fried plantain"],
    category: category.seasonings,
  },
  {
    id: "coat-and-cook",
    slug: "coat-and-cook",
    name: "Coat & Cook",
    variants: single("250g", 350),
    summary: "A crisp coating for grilling chicken, beef and salmon.",
    description:
      "Coat the meat or fish and cook it — that is the whole method. Made for grilling chicken, beef and salmon, and just as good frying or thickening a sauce.\n\nWheat flour, maize starch, garlic, onion, spices and herbs. No artificial preservatives.\n\nMade in Corby to the recipe we started with in 2008.",
    ingredients: [
      "Wheat Flour",
      "Maize Starch",
      "Salt",
      "Spices",
      "Garlic",
      "Onion",
      "Yeast Extract",
      "Black Pepper",
      "Herbs",
    ],
    allergens: ["Wheat (gluten)"],
    dietary: ["No artificial preservatives"],
    image: {
      url: "/products/cutout/coat-and-cook.png",
      alt: "Jar of Efamy Coat & Cook seasoned coating mix, 250g",
      width: 900,
      height: 900,
    },
    storage: "Store in a cool, dry place. Keep the container sealed after use.",
    servingSuggestions: ["Chicken", "Fish", "Meat", "Vegetables"],
    category: category.seasonings,
  },
];

export const featuredSlugs = [
  "chicken-chilli-sauce-hot",
  "beef-chilli-sauce-hot",
  "pork-chilli-sauce-hot",
  "fish-chilli-sauce-hot",
];

/*
 * Shown on the home page as "Best sellers". Efamy has sold through shops since
 * 2008, so the label is grounded in real trade — but this particular four is a
 * stand-in until Mr Emmanuel confirms which actually move fastest. Swap the
 * slugs when he does; no other change is needed.
 */
export const bestSellerSlugs = [
  "all-purpose-seasoning-mix",
  "beans-chilli-sauce-mild",
  "kelewele-seasoning-mix",
  "coat-and-cook",
];

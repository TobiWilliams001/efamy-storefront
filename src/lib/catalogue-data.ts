import type {
  Heat,
  Product,
  ProductCategory,
  ProductImage,
  ProductVariant,
} from "@/types/product";

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

/**
 * Four sizes at one strength. A sauce sold mild and hot gets two calls, so the
 * customer picks the flavour first and the strength second.
 *
 * Price does not vary by strength — the same recipe, more or less chilli.
 */
function sauceSizes(
  heat: Heat,
  p175: number,
  p250: number,
  p500: number,
  p800: number,
  image?: ProductImage,
): ProductVariant[] {
  return [
    { size: "175g", heat, price: p175, inStock: true, image },
    { size: "250g", heat, price: p250, inStock: true, image },
    { size: "500g", heat, price: p500, inStock: true, image },
    { size: "800g", heat, price: p800, inStock: true, image },
  ];
}

/** A jar photographed for one strength, where mild and hot look different. */
function jar(
  file: string,
  alt: string,
  width = 700,
  height = 900,
): ProductImage {
  return { url: `/products/cutout/${file}.png`, alt, width, height };
}

const BEANS = (heat: Heat, image?: ProductImage) =>
  sauceSizes(heat, 275, 425, 825, 1150, image);
const MEAT = (heat: Heat, image?: ProductImage) =>
  sauceSizes(heat, 325, 475, 875, 1250, image);

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
    id: "beans-chilli-sauce",
    slug: "beans-chilli-sauce",
    name: "Beans Chilli Sauce",
    variants: BEANS("mild"),
    summary:
      "Red kidney beans and green lentils in a gentle chilli sauce. Vegan.",
    description:
      "Red kidney beans and green lentils in a chilli sauce built on fresh ginger, garlic and onions. Mild, so the flavour comes through before the heat does.\n\nSpoon it over rice, stir it through pasta or couscous, or serve it alongside grilled vegetables. It is substantial enough to be the meal rather than the thing beside it.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    dietary: ["Suitable for vegetarians", "Suitable for vegans"],
    image: {
      url: "/products/cutout/beans-chilli-sauce-mild.png",
      alt: "Jar of Efamy beans chilli sauce with a dark green label",
      width: 720,
      height: 900,
    },
    storage: STORAGE_SAUCE,
    servingSuggestions: ["Rice and stew", "Jollof", "Grilled vegetables"],
    category: category.sauces,
  },
  {
    id: "beef-chilli-sauce",
    slug: "beef-chilli-sauce",
    name: "Beef Chilli Sauce",
    variants: [
      ...MEAT(
        "mild",
        jar(
          "beef-chilli-sauce-mild",
          "Jar of Efamy beef chilli sauce, mild",
          675,
        ),
      ),
      ...MEAT(
        "hot",
        jar(
          "beef-chilli-sauce-hot",
          "Jar of Efamy beef chilli sauce, hot",
          675,
        ),
      ),
    ],
    summary: "Chunks of real beef, in mild or hot.",
    description:
      "Real beef in pieces you can see, not a smooth paste. Fresh ginger, garlic and onions are the base, and the same recipe carries both strengths. Mild simply has less chilli.\n\nSpoon it over rice and stew, stir it through jollof, or take a jar to a barbecue.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    dietary: ["No artificial preservatives"],
    image: {
      url: "/products/cutout/beef-chilli-sauce-hot.png",
      alt: "Jar of Efamy beef chilli sauce with a burgundy label",
      width: 700,
      height: 900,
    },
    storage: STORAGE_SAUCE,
    servingSuggestions: ["Rice and stew", "Jollof", "Chips"],
    category: category.sauces,
  },
  {
    id: "chicken-chilli-sauce",
    slug: "chicken-chilli-sauce",
    name: "Chicken Chilli Sauce",
    variants: MEAT("hot"),
    summary: "Chunks of real chicken in a chilli sauce with a proper kick.",
    description:
      "Real chicken in pieces you can see, cooked into a sauce built on fresh ginger, garlic and onions.\n\nSpoon it over rice, stir it through pasta, or serve it with fried plantain and yam.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    dietary: ["No artificial preservatives"],
    image: {
      url: "/products/cutout/chicken-chilli-sauce-hot.png",
      alt: "Jar of Efamy chicken chilli sauce with an orange label",
      width: 700,
      height: 900,
    },
    storage: STORAGE_SAUCE,
    servingSuggestions: ["Rice", "Fried plantain", "Yam"],
    category: category.sauces,
  },
  {
    id: "fish-chilli-sauce",
    slug: "fish-chilli-sauce",
    name: "Fish Chilli Sauce",
    variants: [
      ...MEAT(
        "mild",
        jar(
          "fish-chilli-sauce-mild",
          "Jar of Efamy fish chilli sauce, mild",
          675,
        ),
      ),
      ...MEAT(
        "hot",
        jar(
          "fish-chilli-sauce-hot",
          "Jar of Efamy fish chilli sauce, hot",
          675,
        ),
      ),
    ],
    summary: "Chunks of real fish, in mild or hot.",
    description:
      "Made mainly with barracuda, in pieces you can see rather than a smooth paste. Fresh ginger, garlic and onions carry it, and the same recipe carries both strengths.\n\nThe jar for kenkey and fish, for waakye, or for rice that needs waking up.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
    allergens: ["Fish"],
    dietary: ["No artificial preservatives"],
    image: {
      url: "/products/cutout/fish-chilli-sauce-hot.png",
      alt: "Jar of Efamy fish chilli sauce with a green label",
      width: 700,
      height: 900,
    },
    storage: STORAGE_SAUCE,
    servingSuggestions: ["Kenkey", "Waakye", "Rice"],
    category: category.sauces,
  },
  {
    id: "pork-chilli-sauce",
    slug: "pork-chilli-sauce",
    name: "Pork Chilli Sauce",
    variants: MEAT("hot"),
    summary: "Chunks of real pork in a chilli sauce with a proper kick.",
    description:
      "Real pork in pieces you can see, cooked into a sauce built on fresh ginger, garlic and onions.\n\nGood over rice, with chips, or taken to a barbecue where it tends not to come home again.\n\nMade in Corby to the recipe we started with in 2008. No colours, additives or preservatives.",
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
      alt: "Jar of Efamy pork chilli sauce with a pink label",
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
      "Spices, negro pepper, chilli powder and crushed chilli peppers, the blend we first made in December 2015.\n\nIts home is kelewele, spiced fried plantain, but it earns its place at a barbecue and on kebabs just as easily.\n\nMade in Corby. No colours, additives or preservatives.",
    image: {
      url: "/products/cutout/kelewele-seasoning-mix.png",
      alt: "Bottle of Efamy kelewele seasoning mix",
      width: 1254,
      height: 1254,
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
      "Coat the meat or fish and cook it. That is the whole method. Made for grilling chicken, beef and salmon, and just as good frying or thickening a sauce.\n\nWheat flour, maize starch, garlic, onion, spices and herbs. No artificial preservatives.\n\nMade in Corby to the recipe we started with in 2008.",
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
  "chicken-chilli-sauce",
  "beef-chilli-sauce",
  "pork-chilli-sauce",
  "fish-chilli-sauce",
];

/*
 * Shown on the home page as "Best sellers". Efamy has sold through shops since
 * 2008, so the label is grounded in real trade — but this particular four is a
 * stand-in until Mr Emmanuel confirms which actually move fastest. Swap the
 * slugs when he does; no other change is needed.
 */
export const bestSellerSlugs = [
  "all-purpose-seasoning-mix",
  "beans-chilli-sauce",
  "kelewele-seasoning-mix",
  "coat-and-cook",
];

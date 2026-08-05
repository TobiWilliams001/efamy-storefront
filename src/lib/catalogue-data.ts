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
      "Slow-cooked chilli sauces in beans, beef, chicken, fish and pork, each in mild or hot.",
    image: {
      url: "/products/cutout/chicken-chilli-sauce-hot-250g.png",
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
    summary: "A mild bean chilli sauce, suitable for vegetarians and vegans.",
    description:
      "A mild chilli sauce made with beans. Suitable for vegetarians and vegans.",
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
    summary: "Beef chilli sauce with a gentler heat.",
    description: "Beef chilli sauce, mild.",
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
    summary:
      "Made with premium beef. Rich and spicy, with no artificial preservatives.",
    description:
      "Beef chilli sauce with a bold heat. Made with premium beef and no artificial preservatives.",
    heat: "hot",
    dietary: ["No artificial preservatives"],
    image: {
      url: "/products/cutout/beef-chilli-sauce-hot-250g.png",
      alt: "Jar of Efamy beef chilli sauce, hot, 250g",
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
    summary:
      "Made with premium chicken. Rich and spicy, with no artificial preservatives.",
    description:
      "Chicken chilli sauce with a bold heat. Made with premium chicken and no artificial preservatives.",
    heat: "hot",
    dietary: ["No artificial preservatives"],
    image: {
      url: "/products/cutout/chicken-chilli-sauce-hot-250g.png",
      alt: "Jar of Efamy chicken chilli sauce, hot, 250g",
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
    summary: "Fish chilli sauce with a gentler heat.",
    description: "Fish chilli sauce, mild.",
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
    summary: "Fish chilli sauce with a bold heat.",
    description: "Fish chilli sauce, hot.",
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
    summary:
      "Pork chilli sauce with a bold heat and no artificial preservatives.",
    description:
      "Pork chilli sauce, hot. Store in a cool, dry place. Refrigerate after opening and use within 4 weeks.",
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
    variants: single("300g", 325),
    summary: "The spice blend for kelewele, spiced fried plantain.",
    description:
      "A seasoning mix for making kelewele, Ghanaian spiced fried plantain.",
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
    summary: "A crisp coating for chicken, fish, meat and vegetables.",
    description:
      "Coat & Cook gives a crispy coating with no artificial preservatives. Store in a cool, dry place and keep the container sealed after use.",
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

export const bestSellerSlugs = [
  "all-purpose-seasoning-mix",
  "beans-chilli-sauce-mild",
  "kelewele-seasoning-mix",
  "coat-and-cook",
];

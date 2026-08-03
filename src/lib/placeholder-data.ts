import type { Product, ProductCategory } from "@/types/product";

// TEMPORARY. Delete once the CMS-backed data layer lands.

export const placeholderCategories: ProductCategory[] = [
  {
    id: "cat-sauces",
    slug: "chilli-sauces",
    name: "Chilli Sauces",
    description:
      "Slow-cooked sauces built on scotch bonnet, tomato and West African aromatics.",
    image: {
      url: "/images/placeholder/category-sauces.png",
      alt: "A bowl of rich red Ghanaian chilli sauce beside fresh scotch bonnet peppers",
      width: 1200,
      height: 900,
    },
    productCount: 6,
  },
  {
    id: "cat-oils",
    slug: "chilli-oils",
    name: "Chilli Oils",
    description:
      "Infused oils layered with toasted spice — for finishing, dipping and drizzling.",
    image: {
      url: "/images/placeholder/category-oils.png",
      alt: "Golden chilli oil being spooned from a jar, flecked with dried chilli",
      width: 1200,
      height: 900,
    },
    productCount: 4,
  },
  {
    id: "cat-seasonings",
    slug: "seasonings",
    name: "Seasonings",
    description:
      "Dry rubs and spice blends ground in small batches for everyday cooking.",
    image: {
      url: "/images/placeholder/category-seasonings.png",
      alt: "Ground Ghanaian spice blend in a wooden bowl with whole spices scattered around",
      width: 1200,
      height: 900,
    },
    productCount: 5,
  },
];

const category = {
  sauces: { slug: "chilli-sauces", name: "Chilli Sauces" },
  oils: { slug: "chilli-oils", name: "Chilli Oils" },
  seasonings: { slug: "seasonings", name: "Seasonings" },
} as const;

export const placeholderProducts: Product[] = [
  {
    id: "p-shito-hot",
    slug: "shito-hot",
    name: "Shito — Hot",
    summary:
      "The Ghanaian classic: dried shrimp, chilli and ginger, slow-fried.",
    description:
      "Our signature shito is cooked low and slow until the oil separates and the flavour deepens. Dried shrimp and smoked fish give it savoury weight; scotch bonnet and ginger carry the heat.",
    price: 750,
    size: "250ml",
    heatLevel: 4,
    image: {
      url: "/images/placeholder/sauce-1.png",
      alt: "Jar of Efamy hot shito, a dark red-brown Ghanaian chilli sauce",
      width: 1000,
      height: 1250,
    },
    category: category.sauces,
    inStock: true,
    isNew: true,
  },
  {
    id: "p-shito-mild",
    slug: "shito-mild",
    name: "Shito — Mild",
    summary:
      "All the depth of our classic shito, dialled back for everyday heat.",
    description:
      "Same slow-fried base, less scotch bonnet. Built for anyone who wants the savoury, smoky character without the burn.",
    price: 750,
    compareAtPrice: 950,
    size: "250ml",
    heatLevel: 2,
    image: {
      url: "/images/placeholder/sauce-2.png",
      alt: "Jar of Efamy mild shito, a deep red Ghanaian chilli sauce",
      width: 1000,
      height: 1250,
    },
    category: category.sauces,
    inStock: true,
  },
  {
    id: "p-chilli-oil",
    slug: "scotch-bonnet-chilli-oil",
    name: "Scotch Bonnet Chilli Oil",
    summary: "Bright, fruity heat in a clean finishing oil.",
    description:
      "Scotch bonnet infused gently into oil so the fruit character survives. Spoon over eggs, rice, grilled fish or anything that needs lifting.",
    price: 850,
    size: "200ml",
    heatLevel: 5,
    image: {
      url: "/images/placeholder/oil-1.png",
      alt: "Bottle of Efamy scotch bonnet chilli oil, deep amber with chilli flecks",
      width: 1000,
      height: 1250,
    },
    category: category.oils,
    inStock: true,
  },
  {
    id: "p-garlic-oil",
    slug: "toasted-garlic-chilli-oil",
    name: "Toasted Garlic Chilli Oil",
    summary: "Crisp garlic and mild chilli — the one that goes on everything.",
    description:
      "Garlic toasted to the edge of sweet, then folded into a gently spiced oil. Crunchy, aromatic and hard to stop eating.",
    price: 850,
    size: "200ml",
    heatLevel: 2,
    image: {
      url: "/images/placeholder/oil-2.png",
      alt: "Bottle of Efamy toasted garlic chilli oil with visible garlic pieces",
      width: 1000,
      height: 1250,
    },
    category: category.oils,
    inStock: false,
  },
  {
    id: "p-suya",
    slug: "suya-spice",
    name: "Suya Spice",
    summary: "Groundnut, chilli and ginger — the West African grilling rub.",
    description:
      "Roasted groundnut ground with chilli, ginger and warm spice. Rub it into beef or chicken before grilling, or use it as a finishing seasoning.",
    price: 550,
    size: "80g",
    heatLevel: 3,
    image: {
      url: "/images/placeholder/seasoning-1.png",
      alt: "Pouch of Efamy suya spice beside a mound of the reddish-brown blend",
      width: 1000,
      height: 1250,
    },
    category: category.seasonings,
    inStock: true,
  },
  {
    id: "p-jollof",
    slug: "jollof-seasoning",
    name: "Jollof Seasoning",
    summary: "A balanced base blend for jollof rice, stews and soups.",
    description:
      "Everything a good jollof needs in one blend — no measuring, no guesswork. Also works as an all-purpose base for stews.",
    price: 550,
    size: "100g",
    heatLevel: 1,
    image: {
      url: "/images/placeholder/seasoning-2.png",
      alt: "Pouch of Efamy jollof seasoning with the warm-toned spice blend spilling out",
      width: 1000,
      height: 1250,
    },
    category: category.seasonings,
    inStock: true,
  },
];

export const routes = {
  home: "/",
  shop: "/shop",
  /** The shop with a category filter applied, not a page of its own. */
  category: (slug: string) => `/shop?category=${slug}`,
  product: (slug: string) => `/products/${slug}`,
  recipes: "/recipes",
  recipe: (slug: string) => `/recipes/${slug}`,
  about: "/about",
  contact: "/contact",
  stockists: "/stockists",
  faq: "/faq",
  cart: "/cart",
  checkout: "/checkout",
  privacy: "/privacy",
  terms: "/terms",
  returns: "/returns",
} as const;

/**
 * Every internal URL is built here so paths are never re-typed across the
 * header, footer, cards and breadcrumbs. When `typedRoutes` is enabled in
 * `next.config.ts` (worth doing once the real routes exist), this is the one
 * file that needs to change.
 */
export const routes = {
  home: "/",
  shop: "/shop",
  category: (slug: string) => `/shop/${slug}`,
  product: (slug: string) => `/products/${slug}`,
  about: "/about",
  contact: "/contact",
  stockists: "/stockists",
  cart: "/cart",
  checkout: "/checkout",
  privacy: "/privacy",
  terms: "/terms",
  returns: "/returns",
} as const;

import { defineQuery } from "next-sanity";

const IMAGE_FIELDS = `
  "url": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "blurDataURL": asset->metadata.lqip
`;

const PRODUCT_FIELDS = `
  "id": _id,
  name,
  "slug": slug.current,
  summary,
  description,
  variants[]{size, price, compareAtPrice, "inStock": coalesce(inStock, true)},
  heat,
  ingredients,
  allergens,
  dietary,
  storage,
  shelfLife,
  certifications,
  servingSuggestions,
  nutrition[]{label, value},
  image{${IMAGE_FIELDS}},
  images[]{${IMAGE_FIELDS}},
  category->{"slug": slug.current, name},
  bundleItems[]->{"slug": slug.current, name},
  isNew,
  featured,
  bestSeller,
  order
`;

const ORDER_BY = `order(coalesce(order, 9999) asc, name asc)`;

export const PRODUCTS_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current)] | ${ORDER_BY}{${PRODUCT_FIELDS}}`,
);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0]{${PRODUCT_FIELDS}}`,
);

export const FEATURED_PRODUCTS_QUERY = defineQuery(
  `*[_type == "product" && featured == true && defined(slug.current)] | ${ORDER_BY}[0...$limit]{${PRODUCT_FIELDS}}`,
);

export const BEST_SELLERS_QUERY = defineQuery(
  `*[_type == "product" && bestSeller == true && defined(slug.current)] | ${ORDER_BY}[0...$limit]{${PRODUCT_FIELDS}}`,
);

export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "productCategory" && defined(slug.current)] | order(name asc){
    "id": _id,
    name,
    "slug": slug.current,
    description,
    image{${IMAGE_FIELDS}},
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,
);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(
  `*[_type == "productCategory" && slug.current == $slug][0]{
    "id": _id,
    name,
    "slug": slug.current,
    description,
    image{${IMAGE_FIELDS}},
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,
);

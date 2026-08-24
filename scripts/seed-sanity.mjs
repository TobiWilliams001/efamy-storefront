// Pushes the static catalogue into Sanity: images, categories, then products.
//
//   pnpm seed          (reads SANITY_API_WRITE_TOKEN from .env.local)
//   pnpm seed --dry    (prints what it would write, no token needed)
//
// Safe to run more than once. Documents are matched on slug, so a second run
// updates what is already there rather than creating duplicates. Pass --dry to
// see what it would do without writing.
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { basename } from "node:path";

import {
  bestSellerSlugs,
  categories,
  featuredSlugs,
  products,
} from "../src/lib/catalogue-data.ts";
import { recipes } from "../src/lib/recipes.ts";

const token = process.env.SANITY_API_WRITE_TOKEN;
const dry = process.argv.includes("--dry");

if (!token && !dry) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN.\n" +
      "Create one at https://sanity.io/manage with Editor permissions, add it to\n" +
      ".env.local, which is gitignored, and run: pnpm seed",
  );
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "vlmwys9m",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-05-15",
  token,
  useCdn: false,
});

/*
 * Caches the upload promise, not its result. The variants of one strength are
 * uploaded concurrently and share a photograph, so caching the result let all
 * four start before the first finished: the same file went up four times and
 * left duplicate assets behind.
 */
const uploaded = new Map();

function uploadImage(image) {
  const existing = uploaded.get(image.url);
  if (existing) return existing;

  const file = `public${image.url}`;
  const pending = client.assets
    .upload("image", readFileSync(file), { filename: basename(file) })
    .then((asset) => {
      console.log(`   uploaded ${basename(file)}`);
      return asset._id;
    });

  uploaded.set(image.url, pending);
  return pending;
}

/** The asset is shared; the alt text belongs to whoever is using it. */
async function imageRef(image) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: await uploadImage(image) },
    alt: image.alt,
  };
}

async function findBySlug(type, slug) {
  return client.fetch(`*[_type == $type && slug.current == $slug][0]._id`, {
    type,
    slug,
  });
}

async function run() {
  console.log(
    `${dry ? "DRY RUN — " : ""}seeding ${categories.length} categories, ` +
      `${products.length} products and ${recipes.length} recipes\n`,
  );

  const categoryIds = new Map();
  const productIds = new Map();

  for (const category of categories) {
    console.log(`category: ${category.name}`);
    if (dry) {
      categoryIds.set(category.slug, "dry");
      continue;
    }
    const image = await imageRef(category.image);
    const doc = {
      _type: "productCategory",
      name: category.name,
      slug: { _type: "slug", current: category.slug },
      description: category.description,
      image,
    };
    const existing = await findBySlug("productCategory", category.slug);
    const saved = existing
      ? await client.patch(existing).set(doc).commit()
      : await client.create(doc);
    categoryIds.set(category.slug, saved._id);
  }

  for (const product of products) {
    console.log(`product: ${product.name}`);
    if (dry) continue;

    const image = await imageRef(product.image);
    const extra = [];
    for (const entry of product.images ?? []) {
      extra.push({ ...(await imageRef(entry)), _key: basename(entry.url) });
    }

    const doc = {
      _type: "product",
      name: product.name,
      slug: { _type: "slug", current: product.slug },
      summary: product.summary,
      description: product.description,
      /*
       * Strength and the per-strength photograph both belong on the variant.
       * Dropping them cost the shop its heat filter and left Beef listing
       * 175g twice, because the key was the size and a sauce sold mild and
       * hot repeats every size.
       */
      variants: await Promise.all(
        product.variants.map(async (variant) => ({
          _type: "variant",
          _key: [variant.heat, variant.size].filter(Boolean).join("-"),
          heat: variant.heat,
          size: variant.size,
          price: variant.price,
          inStock: variant.inStock,
          image: variant.image ? await imageRef(variant.image) : undefined,
        })),
      ),
      category: {
        _type: "reference",
        _ref: categoryIds.get(product.category.slug),
      },
      image,
      ...(extra.length ? { images: extra } : {}),
      ...(product.heat ? { heat: product.heat } : {}),
      ...(product.ingredients ? { ingredients: product.ingredients } : {}),
      ...(product.allergens ? { allergens: product.allergens } : {}),
      ...(product.dietary ? { dietary: product.dietary } : {}),
      ...(product.storage ? { storage: product.storage } : {}),
      ...(product.servingSuggestions
        ? { servingSuggestions: product.servingSuggestions }
        : {}),
      isNew: product.isNew === true,
      featured: featuredSlugs.includes(product.slug),
      bestSeller: bestSellerSlugs.includes(product.slug),
    };

    const existing = await findBySlug("product", product.slug);
    const saved = existing
      ? await client.patch(existing).set(doc).commit()
      : await client.create(doc);
    productIds.set(product.slug, saved._id);
  }

  for (const recipe of recipes) {
    console.log(`recipe: ${recipe.title}`);
    if (dry) continue;

    const productId = productIds.get(recipe.productSlug);
    if (!productId) {
      // The site renders no product panel when this misses, silently, so it is
      // worth saying out loud rather than seeding a recipe that points nowhere.
      console.warn(`   no product for "${recipe.productSlug}", skipping`);
      continue;
    }

    const doc = {
      _type: "recipe",
      title: recipe.title,
      slug: { _type: "slug", current: recipe.slug },
      summary: recipe.summary,
      product: { _type: "reference", _ref: productId },
      serves: recipe.serves,
      prepMinutes: recipe.prepMinutes,
      cookMinutes: recipe.cookMinutes,
      ingredients: recipe.ingredients,
      method: recipe.method,
      ...(recipe.image
        ? {
            image: await imageRef({
              url: recipe.image,
              alt: `${recipe.title}, made with Efamy`,
            }),
          }
        : {}),
    };

    const existing = await findBySlug("recipe", recipe.slug);
    if (existing) await client.patch(existing).set(doc).commit();
    else await client.create(doc);
  }

  console.log(
    dry
      ? "\nDry run complete. Nothing was written."
      : "\nDone. Open the Studio to review, and check the site still renders.",
  );
}

run().catch((error) => {
  console.error("\nSeeding failed:", error.message);

  /*
   * The failure worth explaining. A token authenticates but holds no role in
   * the project, which is what a Deploy Studio token looks like when it is
   * asked to write content. Sanity cannot change a token's role after it is
   * made, so the fix is always a new one.
   */
  if (/projectUserNotFound|not found for user ID/.test(error.message)) {
    console.error(
      "\nThat token has no role on this project, so it cannot read or write\n" +
        "content. A Deploy Studio token does this: it can push a Studio build\n" +
        "and nothing else.\n\n" +
        "At sanity.io/manage, open the project, then API, then Tokens, and add\n" +
        "one with the Editor role. Put it in .env.local and run pnpm seed again.",
    );
  }

  process.exit(1);
});

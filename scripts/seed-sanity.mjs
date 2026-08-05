// Pushes the static catalogue into Sanity: images, categories, then products.
//
//   SANITY_API_WRITE_TOKEN=xxx node --experimental-strip-types scripts/seed-sanity.mjs
//
// Safe to run more than once. Documents are matched on slug, so a second run
// updates what is already there rather than creating duplicates. Pass --dry to
// see what it would do without writing.
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { basename } from "node:path";

import { categories, products } from "../src/lib/catalogue-data.ts";

const token = process.env.SANITY_API_WRITE_TOKEN;
const dry = process.argv.includes("--dry");

if (!token && !dry) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN.\n" +
      "Create one at https://sanity.io/manage with Editor permissions, then:\n" +
      "  SANITY_API_WRITE_TOKEN=xxx node --experimental-strip-types scripts/seed-sanity.mjs",
  );
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "mxc2ll2l",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-05-15",
  token,
  useCdn: false,
});

const uploaded = new Map();

async function uploadImage(image) {
  if (uploaded.has(image.url)) return uploaded.get(image.url);
  const file = `public${image.url}`;
  const asset = await client.assets.upload("image", readFileSync(file), {
    filename: basename(file),
  });
  const ref = {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt: image.alt,
  };
  uploaded.set(image.url, ref);
  console.log(`   uploaded ${basename(file)}`);
  return ref;
}

async function findBySlug(type, slug) {
  return client.fetch(`*[_type == $type && slug.current == $slug][0]._id`, {
    type,
    slug,
  });
}

async function run() {
  console.log(
    `${dry ? "DRY RUN — " : ""}seeding ${categories.length} categories and ${products.length} products\n`,
  );

  const categoryIds = new Map();

  for (const category of categories) {
    console.log(`category: ${category.name}`);
    if (dry) {
      categoryIds.set(category.slug, "dry");
      continue;
    }
    const image = await uploadImage(category.image);
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

    const image = await uploadImage(product.image);
    const extra = [];
    for (const entry of product.images ?? []) {
      extra.push({ ...(await uploadImage(entry)), _key: basename(entry.url) });
    }

    const doc = {
      _type: "product",
      name: product.name,
      slug: { _type: "slug", current: product.slug },
      summary: product.summary,
      description: product.description,
      variants: product.variants.map((variant) => ({
        _type: "variant",
        _key: variant.size,
        size: variant.size,
        price: variant.price,
        inStock: variant.inStock,
      })),
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
      featured: ["chicken-chilli-sauce-hot", "beef-chilli-sauce-hot"].includes(
        product.slug,
      ),
      bestSeller: ["all-purpose-seasoning-mix", "coat-and-cook"].includes(
        product.slug,
      ),
    };

    const existing = await findBySlug("product", product.slug);
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
  process.exit(1);
});

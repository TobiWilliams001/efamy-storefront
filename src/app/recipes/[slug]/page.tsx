import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users } from "lucide-react";

import { ProductCard } from "@/components/commerce/product-card";
import { RecipeCard } from "@/components/commerce/recipe-card";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/catalogue";
import { productAccent } from "@/lib/product-accent";
import { getRecipe, getRecipes } from "@/lib/catalogue";
import { routes } from "@/lib/routes";
import { recipeSchema, serialiseJsonLd } from "@/lib/structured-data";

export async function generateStaticParams() {
  const recipes = await getRecipes();
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/recipes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) return {};

  return {
    title: recipe.title,
    description: recipe.summary,
    alternates: { canonical: routes.recipe(recipe.slug) },
    openGraph: {
      type: "article",
      title: recipe.title,
      description: recipe.summary,
      ...(recipe.image ? { images: [{ url: recipe.image }] } : {}),
    },
  };
}

export default async function RecipePage({
  params,
}: PageProps<"/recipes/[slug]">) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    notFound();
  }

  const product = await getProductBySlug(recipe.productSlug);
  const others = (await getRecipes())
    .filter((entry) => entry.slug !== recipe.slug)
    .slice(0, 3);
  const total = recipe.prepMinutes + recipe.cookMinutes;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd(recipeSchema(recipe)),
        }}
      />

      <PageHeader
        eyebrow="Recipe"
        title={recipe.title}
        description={recipe.summary}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="max-w-2xl">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-50">
              {recipe.image ? (
                <Image
                  src={recipe.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 700px, 100vw"
                  preload
                  className="object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: productAccent(recipe.productSlug) }}
                  className="block size-full opacity-20"
                />
              )}
            </div>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y py-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock aria-hidden="true" className="size-4 text-gold-ink" />
                <dt className="text-muted-foreground">Total</dt>
                <dd data-numeric className="font-medium">
                  {total} min
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <Users aria-hidden="true" className="size-4 text-gold-ink" />
                <dt className="text-muted-foreground">Serves</dt>
                <dd data-numeric className="font-medium">
                  {recipe.serves}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="text-muted-foreground">Prep</dt>
                <dd data-numeric className="font-medium">
                  {recipe.prepMinutes} min
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="text-muted-foreground">Cook</dt>
                <dd data-numeric className="font-medium">
                  {recipe.cookMinutes} min
                </dd>
              </div>
            </dl>

            <h2 className="mt-12 font-heading text-2xl">Ingredients</h2>
            <ul className="mt-5 space-y-3">
              {recipe.ingredients.map((item) => (
                <li key={item} className="flex gap-3 text-pretty">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-heading text-2xl">Method</h2>
            <ol className="mt-5 space-y-6">
              {recipe.method.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    data-numeric
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-medium text-white"
                  >
                    {index + 1}
                  </span>
                  <p className="pt-1 text-pretty">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {product ? (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="font-heading text-lg">Made with</h2>
              <div className="mt-4">
                <ProductCard product={product} sizes="320px" />
              </div>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-4 w-full"
              >
                <Link href={routes.shop}>Shop the range</Link>
              </Button>
            </aside>
          ) : null}
        </div>
      </Section>

      {others.length ? (
        <Section>
          <h2 className="mb-8 font-heading text-2xl sm:text-3xl">
            More to cook
          </h2>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {others.map((entry) => (
              <li key={entry.slug} className="flex">
                <RecipeCard recipe={entry} className="w-full" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}

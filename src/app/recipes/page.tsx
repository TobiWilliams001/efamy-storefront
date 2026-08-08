import type { Metadata } from "next";

import { RecipeCard } from "@/components/commerce/recipe-card";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { recipes } from "@/lib/recipes";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Ghanaian dishes to cook with Efamy chilli sauces and seasonings: jollof rice, waakye, kelewele, grilled chicken and more.",
  alternates: { canonical: routes.recipes },
};

export default function RecipesPage() {
  return (
    <>
      <PageHeader
        align="center"
        eyebrow="Recipes"
        title="What to cook this week"
        description="The dishes these jars were made for, with the sauce to reach for in each one."
      />

      <Section>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {recipes.map((recipe) => (
            <li key={recipe.slug} className="flex">
              <RecipeCard recipe={recipe} className="w-full" />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

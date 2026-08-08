import Link from "next/link";

import { RecipeCard } from "@/components/commerce/recipe-card";
import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { recipes } from "@/lib/recipes";
import { routes } from "@/lib/routes";

export function RecipeInspiration() {
  return (
    <Section>
      <SectionHeader
        align="center"
        title="Recipe inspiration"
        description="The dishes these jars were made for."
      />
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
        {recipes.slice(0, 3).map((recipe) => (
          <li key={recipe.slug} className="flex">
            <RecipeCard recipe={recipe} className="w-full" />
          </li>
        ))}
      </ul>
      <div className="mt-10 text-center">
        <Button asChild size="xl" variant="accent">
          <Link href={routes.recipes}>View all recipes</Link>
        </Button>
      </div>
    </Section>
  );
}

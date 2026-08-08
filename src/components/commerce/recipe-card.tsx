import Image from "next/image";
import Link from "next/link";
import { Clock, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { productAccent } from "@/lib/product-accent";
import { routes } from "@/lib/routes";
import type { Recipe } from "@/lib/recipes";
import { cn } from "@/lib/utils";

export function RecipeCard({
  recipe,
  className,
}: {
  recipe: Recipe;
  className?: string;
}) {
  const total = recipe.prepMinutes + recipe.cookMinutes;

  return (
    <Card
      className={cn(
        "group relative gap-0 py-0 transition-shadow duration-200 hover:shadow-card-hover",
        className,
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <span
            aria-hidden="true"
            style={{ backgroundColor: productAccent(recipe.productSlug) }}
            className="block size-full opacity-20"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg leading-snug">
          <Link
            href={routes.recipe(recipe.slug)}
            className="decoration-1 underline-offset-4 group-hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {recipe.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-pretty text-muted-foreground">
          {recipe.summary}
        </p>

        <div className="mt-5 flex items-center gap-4 border-t pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="size-3.5" />
            <span data-numeric>{total} min</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users aria-hidden="true" className="size-3.5" />
            <span data-numeric>Serves {recipe.serves}</span>
          </span>
        </div>
      </div>
    </Card>
  );
}

import { CallToAction } from "@/components/sections/call-to-action";
import { CategoryShowcase } from "@/components/sections/category-showcase";
import { HeatGuide } from "@/components/sections/heat-guide";
import { MealPairings } from "@/components/sections/meal-pairings";
import { HomeHero } from "@/components/sections/hero";
import { RecipeInspiration } from "@/components/sections/recipe-inspiration";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Statement } from "@/components/sections/statement";
import { Testimonials } from "@/components/sections/testimonials";
import {
  getBestSellers,
  getCategories,
  getFeaturedProducts,
} from "@/lib/catalogue";
import { routes } from "@/lib/routes";

export default async function HomePage() {
  const [featured, categories, bestSellers] = await Promise.all([
    getFeaturedProducts(3),
    getCategories(),
    getBestSellers(3),
  ]);

  return (
    <>
      <HomeHero />
      <CategoryShowcase categories={categories} />
      <ProductShowcase
        eyebrow="Featured"
        title="Start here"
        description="The jars we would hand you first."
        products={featured}
        action={{ label: "View all", href: routes.shop }}
      />
      <MealPairings />
      <HeatGuide />
      <Statement />
      <Testimonials />
      <RecipeInspiration />
      <ProductShowcase
        eyebrow="Cupboard staples"
        title="The jars that earn their shelf"
        products={bestSellers}
        action={{ label: "View all", href: routes.shop }}
        surface="muted"
      />
      <CallToAction />
    </>
  );
}

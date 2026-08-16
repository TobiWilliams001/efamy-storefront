import { CallToAction } from "@/components/sections/call-to-action";
import { ExploreLinks } from "@/components/sections/explore-links";
import { HeatGuide } from "@/components/sections/heat-guide";
import { MealPairings } from "@/components/sections/meal-pairings";
import { HomeHero } from "@/components/sections/hero";
import { RecipeInspiration } from "@/components/sections/recipe-inspiration";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Statement } from "@/components/sections/statement";
import { Testimonials } from "@/components/sections/testimonials";
import { getBestSellers, getFeaturedProducts } from "@/lib/catalogue";
import { routes } from "@/lib/routes";

export default async function HomePage() {
  const [featured, bestSellers] = await Promise.all([
    getFeaturedProducts(3),
    getBestSellers(3),
  ]);

  return (
    <>
      <HomeHero />
      <ProductShowcase
        eyebrow="Featured"
        title="Start here"
        description="The jars we would hand you first."
        products={featured}
        action={{ label: "View all", href: routes.shop }}
      >
        <ExploreLinks />
      </ProductShowcase>
      <MealPairings />
      <HeatGuide />
      <Statement />
      <Testimonials />
      <RecipeInspiration />
      <ProductShowcase
        eyebrow="Best sellers"
        title="What keeps selling out"
        products={bestSellers}
        action={{ label: "View all", href: routes.shop }}
      />
      <CallToAction />
    </>
  );
}

import { CallToAction } from "@/components/sections/call-to-action";
import { CategoryShowcase } from "@/components/sections/category-showcase";
import { Hero } from "@/components/sections/hero";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { TrustBar } from "@/components/sections/trust-bar";
import { WhyEfamy } from "@/components/sections/why-efamy";
import {
  getBestSellers,
  getCategories,
  getFeaturedProducts,
} from "@/lib/catalogue";
import { routes } from "@/lib/routes";

export default async function HomePage() {
  const [featured, categories, bestSellers] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getBestSellers(),
  ]);

  return (
    <>
      <Hero />
      <TrustBar />
      <ProductShowcase
        eyebrow="Featured"
        title="Start here"
        description="The jars we would hand you first."
        products={featured}
        action={{ label: "View all", href: routes.shop }}
        eagerCount={2}
      />
      <CategoryShowcase categories={categories} />
      <WhyEfamy />
      <ProductShowcase
        eyebrow="Best sellers"
        title="What keeps selling out"
        products={bestSellers}
        action={{ label: "View all", href: routes.shop }}
        surface="muted"
      />
      <CallToAction />
    </>
  );
}

import { CategoryCard } from "@/components/commerce/category-card";
import { Section, SectionHeader } from "@/components/layout/section";
import type { ProductCategory } from "@/types/product";

export function CategoryShowcase({
  categories,
}: {
  categories: ProductCategory[];
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <Section surface="default">
      <SectionHeader
        eyebrow="Browse"
        title="Find your heat"
        description="Chilli sauces built around a protein, and the seasoning mixes that go with them."
      />
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        {categories.map((category) => (
          <li key={category.id} className="flex">
            <CategoryCard category={category} className="w-full" />
          </li>
        ))}
      </ul>
    </Section>
  );
}

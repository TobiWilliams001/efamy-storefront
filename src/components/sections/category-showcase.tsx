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
    <Section surface="muted">
      <SectionHeader
        eyebrow="Browse"
        title="Find your heat"
        description="Three ranges, one idea: proper Ghanaian flavour without the shortcuts."
      />
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li key={category.id} className="flex">
            <CategoryCard category={category} className="w-full" />
          </li>
        ))}
      </ul>
    </Section>
  );
}

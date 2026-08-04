import Link from "next/link";

import { FaqList } from "@/components/common/faq-list";
import { productFaqs } from "@/lib/faqs";
import { routes } from "@/lib/routes";
import type { Product } from "@/types/product";

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t py-8">
      <h2 className="font-heading text-xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  const hasLabelInfo =
    product.ingredients || product.allergens || product.nutrition;

  return (
    <div className="mt-16">
      {product.bundleItems?.length ? (
        <Block title="What is included">
          <ul className="divide-y border-y">
            {product.bundleItems.map((item) => (
              <li key={item.slug} className="flex justify-between gap-4 py-3">
                <Link
                  href={routes.product(item.slug)}
                  className="text-sm underline-offset-4 hover:underline"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {product.servingSuggestions?.length ? (
        <Block title="Best paired with">
          <ul className="flex flex-wrap gap-2">
            {product.servingSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="rounded-full bg-clay/40 px-3 py-1 text-sm"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {hasLabelInfo ? (
        <Block title="What is inside">
          {product.ingredients ? (
            <div>
              <h3 className="text-sm font-medium">Ingredients</h3>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">
                {product.ingredients.join(", ")}.
              </p>
            </div>
          ) : null}

          {product.allergens ? (
            <div className="mt-5">
              <h3 className="text-sm font-medium">Allergens</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Contains {product.allergens.join(", ")}.
              </p>
            </div>
          ) : null}

          {product.nutrition?.length ? (
            <div className="mt-6">
              <h3 className="text-sm font-medium">Nutrition, per 100g</h3>
              <dl className="mt-2 divide-y border-y text-sm">
                {product.nutrition.map((row) => (
                  <div key={row.label} className="flex justify-between py-2">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd data-numeric>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <p className="mt-5 text-sm text-muted-foreground">
            Always check the label on the product you receive before eating.
          </p>
        </Block>
      ) : null}

      {product.storage ? (
        <Block title="Storage">
          <p className="text-sm text-pretty text-muted-foreground">
            {product.storage}
          </p>
        </Block>
      ) : null}

      <Block title="Delivery">
        <p className="text-sm text-pretty text-muted-foreground">
          We ship across the UK from our own kitchen, so orders leave quickly.
          Delivery charges and estimated arrival are shown at checkout before
          you pay.
        </p>
      </Block>

      <Block title="Questions">
        <FaqList faqs={productFaqs} className="border-t-0" />
      </Block>
    </div>
  );
}

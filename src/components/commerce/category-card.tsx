import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";

const DEFAULT_SIZES =
  "(min-width: 1280px) 620px, (min-width: 640px) 50vw, 100vw";

type CategoryCardProps = {
  category: ProductCategory;
  eager?: boolean;
  sizes?: string;
  className?: string;
};

export function CategoryCard({
  category,
  eager = false,
  sizes = DEFAULT_SIZES,
  className,
}: CategoryCardProps) {
  return (
    <article
      className={cn(
        "group relative isolate flex aspect-4/3 overflow-hidden rounded-lg bg-white shadow-card transition-shadow duration-200 focus-within:ring-2 focus-within:ring-ring hover:shadow-card-hover",
        className,
      )}
    >
      <Image
        src={category.image.url}
        alt={category.image.alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        placeholder={category.image.blurDataURL ? "blur" : undefined}
        blurDataURL={category.image.blurDataURL}
        className="object-contain p-10 transition-transform duration-300 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />

      <div className="relative mt-auto flex w-full items-end justify-between gap-4 bg-linear-to-t from-white via-white/95 to-transparent p-6 pt-10">
        <div>
          <h3 className="font-heading text-xl">
            <Link
              href={routes.category(category.slug)}
              className="decoration-1 underline-offset-4 group-hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {category.name}
            </Link>
          </h3>
          {category.productCount !== undefined ? (
            <p
              data-numeric
              className="mt-1 text-xs tracking-wide text-muted-foreground uppercase"
            >
              {category.productCount}{" "}
              {category.productCount === 1 ? "product" : "products"}
            </p>
          ) : null}
        </div>
        <ArrowRight
          aria-hidden="true"
          className="size-5 shrink-0 text-brand transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      </div>
    </article>
  );
}

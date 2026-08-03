import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";

const DEFAULT_SIZES = "(min-width: 640px) 33vw, 100vw";

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
        "group relative isolate flex aspect-4/3 overflow-hidden rounded-xl bg-muted focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
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
        className="object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent"
      />

      <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-5 text-white">
        <div>
          <h3 className="font-heading text-xl leading-snug font-medium">
            <Link
              href={routes.category(category.slug)}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {category.name}
            </Link>
          </h3>
          {category.productCount !== undefined ? (
            <p className="mt-1 text-sm text-white/80">
              {category.productCount}{" "}
              {category.productCount === 1 ? "product" : "products"}
            </p>
          ) : null}
        </div>
        <ArrowRight
          aria-hidden="true"
          className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      </div>
    </article>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

export function ProductGallery({
  image,
  images,
  name,
}: {
  image: ProductImage;
  images?: ProductImage[];
  name: string;
}) {
  const all = [image, ...(images ?? [])];
  const [active, setActive] = useState(0);
  const current = all[active] ?? image;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-linear-to-b from-white to-neutral-50 shadow-card">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          preload={active === 0}
          className="object-contain p-8 sm:p-12"
        />
      </div>

      {all.length > 1 ? (
        <ul className="mt-4 flex flex-wrap gap-3">
          {all.map((entry, index) => (
            <li key={entry.url}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={index === active}
                className={cn(
                  "relative size-20 overflow-hidden rounded-md bg-linear-to-b from-white to-neutral-50 ring-1 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  index === active
                    ? "ring-foreground"
                    : "ring-neutral-200 hover:ring-neutral-400",
                )}
              >
                <Image
                  src={entry.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
                <span className="sr-only">
                  Show image {index + 1} of {all.length} for {name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

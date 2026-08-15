"use client";

import { ProductGallery } from "@/components/commerce/product-gallery";
import { useSelectedImage } from "@/components/commerce/selected-variant";
import type { Product } from "@/types/product";

/** The gallery, showing whichever strength is currently selected. */
export function ProductMedia({ product }: { product: Product }) {
  const image = useSelectedImage(product);

  return (
    <ProductGallery image={image} images={product.images} name={product.name} />
  );
}

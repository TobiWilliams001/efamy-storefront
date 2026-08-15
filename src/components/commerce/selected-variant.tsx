"use client";

import { createContext, useContext, useState } from "react";

import { heatLevels, sizesFor, type Heat, type Product } from "@/types/product";

type SelectionValue = {
  heat: Heat | undefined;
  size: string | undefined;
  setHeat: (heat: Heat | undefined) => void;
  setSize: (size: string) => void;
};

const SelectionContext = createContext<SelectionValue | null>(null);

/**
 * Holds which jar the customer is looking at.
 *
 * The gallery and the buy controls sit at opposite ends of the product page
 * layout, so the choice cannot live in either of them — picking Hot has to
 * change the photograph as well as the price.
 */
export function SelectedVariantProvider({
  product,
  children,
}: {
  product: Product;
  children: React.ReactNode;
}) {
  const strengths = heatLevels(product);
  const [heat, setHeat] = useState<Heat | undefined>(strengths[0]);
  const [size, setSize] = useState<string | undefined>(
    sizesFor(product, strengths[0])[0]?.size,
  );

  // No useMemo: the React Compiler handles this, and a hand-written one with
  // incomplete deps is what it refuses to compile around.
  return (
    <SelectionContext value={{ heat, size, setHeat, setSize }}>
      {children}
    </SelectionContext>
  );
}

export function useSelectedVariant(): SelectionValue {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error(
      "useSelectedVariant must be used within a SelectedVariantProvider",
    );
  }
  return context;
}

/** The jar to show: the selected strength's photograph, or the product's own. */
export function useSelectedImage(product: Product) {
  const { heat } = useSelectedVariant();
  const match = product.variants.find(
    (variant) => variant.heat === heat && variant.image,
  );
  return match?.image ?? product.image;
}

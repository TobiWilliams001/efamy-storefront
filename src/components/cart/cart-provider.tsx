"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import type { Product, ProductVariant } from "@/types/product";

/** All the cart needs to build a line, so cards can add without a full product. */
export type AddableProduct = Pick<Product, "id" | "slug" | "name" | "image">;

const STORAGE_KEY = "efamy.cart.v2";
const MAX_QUANTITY = 99;

export type CartLine = {
  /** productId and size together, because each size is bought separately. */
  id: string;
  productId: string;
  slug: string;
  name: string;
  size: string;
  /** Snapshot in pence. Checkout must re-price server-side before charging. */
  price: number;
  imageUrl: string;
  imageAlt: string;
  quantity: number;
};

function lineId(productId: string, size: string): string {
  return `${productId}:${size}`;
}

type CartState = { lines: CartLine[]; ready: boolean };

type CartAction =
  | {
      type: "add";
      product: AddableProduct;
      variant: ProductVariant;
      quantity: number;
    }
  | { type: "setQuantity"; id: string; quantity: number }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

function clamp(quantity: number): number {
  return Math.max(1, Math.min(MAX_QUANTITY, Math.round(quantity)));
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, ready: true };

    case "add": {
      const id = lineId(action.product.id, action.variant.size);
      const existing = state.lines.find((line) => line.id === id);

      if (existing) {
        return {
          ...state,
          lines: state.lines.map((line) =>
            line.id === id
              ? { ...line, quantity: clamp(line.quantity + action.quantity) }
              : line,
          ),
        };
      }

      return {
        ...state,
        lines: [
          ...state.lines,
          {
            id,
            productId: action.product.id,
            slug: action.product.slug,
            name: action.product.name,
            size: action.variant.size,
            price: action.variant.price,
            imageUrl: action.product.image.url,
            imageAlt: action.product.image.alt,
            quantity: clamp(action.quantity),
          },
        ],
      };
    }

    case "setQuantity":
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.id === action.id
            ? { ...line, quantity: clamp(action.quantity) }
            : line,
        ),
      };

    case "remove":
      return {
        ...state,
        lines: state.lines.filter((line) => line.id !== action.id),
      };

    case "clear":
      return { ...state, lines: [] };
  }
}

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  /** False until localStorage has been read, so the UI can avoid a hydration mismatch. */
  ready: boolean;
  add: (
    product: AddableProduct,
    variant: ProductVariant,
    quantity?: number,
  ) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        typeof (line as CartLine).id === "string" &&
        typeof (line as CartLine).productId === "string" &&
        typeof (line as CartLine).quantity === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], ready: false });
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    dispatch({ type: "hydrate", lines: readStorage() });
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage can be unavailable (private mode, quota). The cart still works
      // for this session.
    }
  }, [state.lines, state.ready]);

  const value = useMemo<CartContextValue>(() => {
    return {
      lines: state.lines,
      itemCount: state.lines.reduce((total, line) => total + line.quantity, 0),
      subtotal: state.lines.reduce(
        (total, line) => total + line.price * line.quantity,
        0,
      ),
      ready: state.ready,
      isOpen,
      setOpen,
      add: (product, variant, quantity = 1) => {
        dispatch({ type: "add", product, variant, quantity });
        setOpen(true);
      },
      setQuantity: (id, quantity) =>
        dispatch({ type: "setQuantity", id, quantity }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state.lines, state.ready, isOpen]);

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

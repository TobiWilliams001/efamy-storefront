"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import type { Product } from "@/types/product";

const STORAGE_KEY = "efamy.cart.v1";
const MAX_QUANTITY = 99;

export type CartLine = {
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

type CartState = { lines: CartLine[]; ready: boolean };

type CartAction =
  | { type: "add"; product: Product; quantity: number }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
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
      const existing = state.lines.find(
        (line) => line.productId === action.product.id,
      );

      if (existing) {
        return {
          ...state,
          lines: state.lines.map((line) =>
            line.productId === action.product.id
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
            productId: action.product.id,
            slug: action.product.slug,
            name: action.product.name,
            size: action.product.size,
            price: action.product.price,
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
          line.productId === action.productId
            ? { ...line, quantity: clamp(action.quantity) }
            : line,
        ),
      };

    case "remove":
      return {
        ...state,
        lines: state.lines.filter(
          (line) => line.productId !== action.productId,
        ),
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
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
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
        typeof (line as CartLine).productId === "string" &&
        typeof (line as CartLine).quantity === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], ready: false });

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
      add: (product, quantity = 1) =>
        dispatch({ type: "add", product, quantity }),
      setQuantity: (productId, quantity) =>
        dispatch({ type: "setQuantity", productId, quantity }),
      remove: (productId) => dispatch({ type: "remove", productId }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state.lines, state.ready]);

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

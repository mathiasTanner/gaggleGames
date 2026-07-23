"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const CART_STORAGE_KEY = "gaggleGamesCart";
const MAX_ITEM_QUANTITY = 99;

export type CartItem = {
  productSlug: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  addItem: (productSlug: string, quantity?: number) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  removeItem: (productSlug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function normalizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_ITEM_QUANTITY, Math.max(1, Math.floor(quantity)));
}

function normalizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  const quantities = new Map<string, number>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;

    const record = item as Record<string, unknown>;
    const productSlug = record.productSlug;
    const quantity = record.quantity;

    if (typeof productSlug !== "string" || !productSlug.trim()) continue;
    if (typeof quantity !== "number") continue;

    quantities.set(
      productSlug,
      normalizeQuantity((quantities.get(productSlug) ?? 0) + quantity)
    );
  }

  return Array.from(quantities, ([productSlug, quantity]) => ({
    productSlug,
    quantity,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setItems(
        normalizeItems(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]"))
      );
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = useCallback((productSlug: string, quantity = 1) => {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.productSlug === productSlug);
      if (!existing) {
        return [
          ...currentItems,
          { productSlug, quantity: normalizeQuantity(quantity) },
        ];
      }

      return currentItems.map((item) =>
        item.productSlug === productSlug
          ? { ...item, quantity: normalizeQuantity(item.quantity + quantity) }
          : item
      );
    });
  }, []);

  const updateQuantity = useCallback((productSlug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((currentItems) =>
        currentItems.filter((item) => item.productSlug !== productSlug)
      );
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productSlug === productSlug
          ? { ...item, quantity: normalizeQuantity(quantity) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((productSlug: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productSlug !== productSlug)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [addItem, clearCart, items, removeItem, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

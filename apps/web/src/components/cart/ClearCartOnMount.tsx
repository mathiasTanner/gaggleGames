"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

export default function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}

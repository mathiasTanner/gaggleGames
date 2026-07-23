"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export default function CartLink() {
  const { totalQuantity } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-grid size-10 place-items-center rounded text-card-foreground transition hover:bg-muted"
      aria-label={
        totalQuantity > 0
          ? `View cart with ${totalQuantity} item${totalQuantity === 1 ? "" : "s"}`
          : "View cart"
      }
    >
      <ShoppingCart className="size-5" aria-hidden="true" />
      {totalQuantity > 0 ? (
        <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold leading-none text-accent-foreground">
          {totalQuantity}
        </span>
      ) : null}
    </Link>
  );
}

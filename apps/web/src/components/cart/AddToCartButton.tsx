"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

type AddToCartButtonProps = {
  productSlug: string;
  disabled?: boolean;
  label?: string;
};

export default function AddToCartButton({
  productSlug,
  disabled = false,
  label = "Add to cart",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem(productSlug);
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
      >
        {added ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <ShoppingCart className="size-4" aria-hidden="true" />
        )}
        {added ? "Added to cart" : label}
      </button>

      {added ? (
        <Link
          href="/cart"
          className="inline-flex h-12 items-center justify-center rounded border border-border px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          View cart
        </Link>
      ) : null}
    </div>
  );
}

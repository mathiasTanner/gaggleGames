"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import {
  formatPrice,
  isPurchasable,
  type Product,
} from "@/lib/strapi/products";

type CartPageClientProps = {
  products: Product[];
};

type CheckoutResponse = {
  url?: string;
  error?: string;
};

export default function CartPageClient({ products }: CartPageClientProps) {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productsBySlug = useMemo(
    () => new Map(products.map((product) => [product.slug, product])),
    [products]
  );

  const cartLines = items.map((item) => ({
    ...item,
    product: productsBySlug.get(item.productSlug),
  }));

  const purchasableLines = cartLines.filter(
    (line) => line.product && isPurchasable(line.product)
  );
  const subtotal = purchasableLines.reduce(
    (total, line) => total + (line.product?.priceCents ?? 0) * line.quantity,
    0
  );
  const currency = purchasableLines[0]?.product?.currency ?? "CHF";

  async function startCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: purchasableLines.map((line) => ({
            productSlug: line.productSlug,
            quantity: line.quantity,
          })),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as CheckoutResponse;
      if (!res.ok || !data.url) {
        throw new Error(
          data.error ?? `Failed to create checkout session (status ${res.status})`
        );
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded border border-border bg-card p-8 text-card-foreground shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">Your cart is empty.</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Add a game from the store and it will appear here.
        </p>
        <Link
          href="/store"
          className="mt-6 inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-[var(--color-primary-hover)]"
        >
          Browse store
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="space-y-4">
        {cartLines.map(({ productSlug, quantity, product }) => {
          const unavailable = !product || !isPurchasable(product);

          return (
            <article
              key={productSlug}
              className="grid gap-4 rounded border border-border bg-card p-4 text-card-foreground shadow-sm sm:grid-cols-[140px_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded bg-secondary">
                {product?.coverImage ? (
                  <Image
                    src={product.coverImage.url}
                    alt={product.coverImage.alternativeText || product.title}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight">
                    {product?.title ?? "Unavailable product"}
                  </h2>
                  {product?.shortDescription ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {product.shortDescription}
                    </p>
                  ) : null}
                  {unavailable ? (
                    <p className="mt-3 text-sm font-medium text-destructive">
                      This item is not currently available for checkout.
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                  {product ? (
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(product.priceCents, product.currency)}
                    </span>
                  ) : null}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(productSlug, quantity - 1)}
                      className="inline-grid size-9 place-items-center rounded border border-border text-foreground transition hover:bg-muted"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </button>
                    <span className="grid h-9 min-w-10 place-items-center rounded border border-border px-3 text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(productSlug, quantity + 1)}
                      className="inline-grid size-9 place-items-center rounded border border-border text-foreground transition hover:bg-muted"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(productSlug)}
                      className="inline-grid size-9 place-items-center rounded border border-border text-destructive transition hover:bg-muted"
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="rounded border border-border bg-card p-5 text-card-foreground shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight">Order summary</h2>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
          <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
          <span className="text-lg font-bold">
            {formatPrice(subtotal, currency)}
          </span>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Shipping, taxes, and final payment details are handled securely in
          Stripe Checkout.
        </p>

        <button
          type="button"
          onClick={startCheckout}
          disabled={loading || purchasableLines.length === 0}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {loading ? "Redirecting..." : "Checkout"}
        </button>

        <button
          type="button"
          onClick={clearCart}
          className="mt-3 inline-flex h-10 w-full items-center justify-center rounded border border-border px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          Clear cart
        </button>

        {error ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </aside>
    </div>
  );
}

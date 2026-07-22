"use client";

import { useState } from "react";

type ProductCheckoutButtonProps = {
  productSlug: string;
  disabled?: boolean;
  label?: string;
};

export default function ProductCheckoutButton({
  productSlug,
  disabled = false,
  label = "Buy now",
}: ProductCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug }),
      });
      const text = await res.text();

      let data: { url?: string; error?: string } = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text };
      }

      if (!res.ok || !data.url) {
        throw new Error(
          data.error ?? `Failed to create checkout session (status ${res.status})`
        );
      }

      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={disabled || loading}
        className="inline-flex h-12 w-full items-center justify-center rounded bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
      >
        {loading ? "Redirecting..." : label}
      </button>

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

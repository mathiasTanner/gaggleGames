"use client";

import { useState } from "react";

export function StripeCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={startCheckout}
        disabled={loading}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ccc",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Redirecting..." : "Start Checkout (Stripe)"}
      </button>
      {error ? <p style={{ marginTop: 8 }}>Warning: {error}</p> : null}
    </div>
  );
}

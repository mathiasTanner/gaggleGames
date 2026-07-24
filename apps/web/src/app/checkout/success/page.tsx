import Link from "next/link";
import ClearCartOnMount from "@/components/cart/ClearCartOnMount";
import Container from "@/components/layout/Container";
import { processCheckoutOrder } from "@/lib/orders/processCheckoutOrder";

type CheckoutSuccessPageProps = {
  searchParams?: Promise<{
    session_id?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderResult = await processCheckoutOrder(params?.session_id);

  return (
    <Container className="py-16">
      <ClearCartOnMount />
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-success">
          Checkout complete
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Thanks for your order.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Your test checkout completed successfully.
        </p>
        {orderResult.ok ? (
          <div className="mt-8 rounded border border-border bg-card p-5 text-card-foreground shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Order number
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {orderResult.orderNumber}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {orderResult.emailStatus === "sent"
                ? "A confirmation email has been sent to your mailbox."
                : "Your order is saved. The confirmation email is still pending, so keep this order number handy."}
            </p>
          </div>
        ) : (
          <div className="mt-8 rounded border border-border bg-card p-5 text-card-foreground shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Order reference
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your payment completed, but we could not load the order reference
              on this page. Please keep your Stripe receipt for now.
            </p>
          </div>
        )}
        <Link
          href="/store"
          className="mt-8 inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-[var(--color-primary-hover)]"
        >
          Back to store
        </Link>
      </div>
    </Container>
  );
}

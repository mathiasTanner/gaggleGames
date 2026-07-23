import Link from "next/link";
import ClearCartOnMount from "@/components/cart/ClearCartOnMount";
import Container from "@/components/layout/Container";

export default function CheckoutSuccessPage() {
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
          Your test checkout completed successfully. Order persistence will come
          in the next shop iteration.
        </p>
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

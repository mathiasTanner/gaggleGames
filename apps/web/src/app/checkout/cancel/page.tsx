import Link from "next/link";
import Container from "@/components/layout/Container";

export default function CheckoutCancelPage() {
  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-warning">
          Checkout cancelled
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          No worries, your game is still here.
        </h1>
        <p className="mt-4 text-muted-foreground">
          You can return to the store and restart checkout whenever you are
          ready.
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

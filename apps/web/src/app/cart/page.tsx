import Container from "@/components/layout/Container";
import CartPageClient from "@/components/cart/CartPageClient";
import { getProducts } from "@/lib/strapi/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cart | Gaggle Games",
  description: "Review your Gaggle Games cart before checkout.",
};

export default async function CartPage() {
  const products = await getProducts();

  return (
    <Container className="py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Cart
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Review your games.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Quantities live in your browser. Prices and availability are refreshed
          from Strapi before Stripe Checkout starts.
        </p>
      </div>

      <CartPageClient products={products} />
    </Container>
  );
}

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import {
  formatPrice,
  getProducts,
  getStockLabel,
  isPurchasable,
} from "@/lib/strapi/products";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const products = await getProducts();

  return (
    <Container className="py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Store
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Board games for your next table.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Browse the first Gaggle Game products managed from Strapi, ready for
          the Stripe checkout flow.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/store/${product.slug}`}
            className="group overflow-hidden rounded border border-border bg-card text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] bg-secondary">
              {product.coverImage ? (
                <Image
                  src={product.coverImage.url}
                  alt={product.coverImage.alternativeText || product.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition group-hover:scale-[1.02]"
                />
              ) : null}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight">
                  {product.title}
                </h2>
                <span className="whitespace-nowrap text-sm font-bold text-primary">
                  {formatPrice(product.priceCents, product.currency)}
                </span>
              </div>

              {product.shortDescription ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {product.shortDescription}
                </p>
              ) : null}

              <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                <span
                  className={
                    isPurchasable(product)
                      ? "font-medium text-success"
                      : "font-medium text-muted-foreground"
                  }
                >
                  {getStockLabel(product.stockStatus)}
                </span>
                <span className="font-semibold text-foreground">View game</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}

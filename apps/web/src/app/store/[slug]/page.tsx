import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import ProductCheckoutButton from "@/components/store/ProductCheckoutButton";
import {
  formatPrice,
  getProductBySlug,
  getStockLabel,
  isPurchasable,
} from "@/lib/strapi/products";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  return {
    title: `${product.title} | Gaggle Game`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) notFound();

  const purchasable = isPurchasable(product);

  return (
    <Container className="py-10">
      <div className="mb-6">
        <Link
          href="/store"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          Back to store
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="overflow-hidden rounded border border-border bg-secondary">
          <div className="relative aspect-[4/3]">
            {product.coverImage ? (
              <Image
                src={product.coverImage.url}
                alt={product.coverImage.alternativeText || product.title}
                fill
                priority
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>
        </div>

        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            {getStockLabel(product.stockStatus)}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {product.title}
          </h1>

          {product.shortDescription ? (
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {product.shortDescription}
            </p>
          ) : null}

          <div className="mt-6 text-3xl font-bold text-foreground">
            {formatPrice(product.priceCents, product.currency)}
          </div>

          {product.description ? (
            <div className="mt-6 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {product.description}
            </div>
          ) : null}

          <div className="mt-8">
            <ProductCheckoutButton
              productSlug={product.slug}
              disabled={!purchasable}
              label={purchasable ? "Buy now" : "Currently unavailable"}
            />
          </div>
        </section>
      </div>
    </Container>
  );
}

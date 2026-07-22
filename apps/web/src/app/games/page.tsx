import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ContentBlocks from "@/components/content/ContentBlocks";
import { getGamesPage } from "@/lib/strapi/gamesPage";
import {
  formatPrice,
  getProducts,
  getStockLabel,
  isPurchasable,
} from "@/lib/strapi/products";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getGamesPage();

  return {
    title: `${page.title} | Gaggle Game`,
    description: page.subtitle,
  };
}

export default async function GamesPage() {
  const [page, products] = await Promise.all([getGamesPage(), getProducts()]);

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-white">
        {page.heroImage ? (
          <Image
            src={page.heroImage.url}
            alt={page.heroImage.alternativeText ?? page.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-hero-overlay-start)_0%,var(--color-hero-overlay-mid)_44%,var(--color-hero-overlay-end)_78%)]" />

        <Container className="relative flex min-h-[460px] items-end py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {page.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f5e7d3]">
              {page.subtitle}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-3xl font-semibold tracking-tight">
            {page.introTitle}
          </h2>
          <div className="space-y-8">
            <div className="whitespace-pre-line text-base leading-8 text-muted-foreground">
              {page.introText}
            </div>
            <ContentBlocks blocks={page.blocks} />
          </div>
        </div>
      </Container>

      <section className="bg-secondary py-14 text-secondary-foreground">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              {page.featuredProductsTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              {page.featuredProductsText}
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/store/${product.slug}`}
                className="group overflow-hidden rounded border border-border bg-card text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-muted">
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
                    <h3 className="text-lg font-semibold tracking-tight">
                      {product.title}
                    </h3>
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
                    <span className="font-semibold text-foreground">
                      View game
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

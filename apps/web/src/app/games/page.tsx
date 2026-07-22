import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ContentBlocks from "@/components/content/ContentBlocks";
import { getGamesPage } from "@/lib/strapi/gamesPage";
import { getProducts } from "@/lib/strapi/products";

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
            {page.eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {page.eyebrow}
              </p>
            ) : null}
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {page.title}
            </h1>
            {page.subtitle ? (
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f5e7d3]">
                {page.subtitle}
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {page.introTitle ? (
            <h2 className="text-3xl font-semibold tracking-tight">
              {page.introTitle}
            </h2>
          ) : null}
          <div className="space-y-8">
            {page.introText ? (
              <div className="whitespace-pre-line text-base leading-8 text-muted-foreground">
                {page.introText}
              </div>
            ) : null}
            <ContentBlocks blocks={page.blocks} />
          </div>
        </div>
      </Container>

      <section className="bg-secondary py-14 text-secondary-foreground">
        <Container>
          {page.featuredProductsTitle || page.featuredProductsText ? (
            <div className="max-w-3xl">
              {page.featuredProductsTitle ? (
                <h2 className="text-3xl font-semibold tracking-tight">
                  {page.featuredProductsTitle}
                </h2>
              ) : null}
              {page.featuredProductsText ? (
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {page.featuredProductsText}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 space-y-8">
            {products.map((product) => (
              <article
                key={product.slug}
                className="grid overflow-hidden rounded border border-border bg-card text-card-foreground shadow-sm lg:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="relative min-h-[280px] bg-muted lg:min-h-[420px]">
                  {product.coverImage ? (
                    <Image
                      src={product.coverImage.url}
                      alt={product.coverImage.alternativeText || product.title}
                      fill
                      sizes="(min-width: 1024px) 44vw, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    Gaggle game
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                    {product.title}
                  </h3>
                  {product.shortDescription ? (
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                      {product.shortDescription}
                    </p>
                  ) : null}

                  {product.description ? (
                    <div className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                      {product.description}
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      href={`/store/${product.slug}`}
                      className="inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-[var(--color-primary-hover)]"
                    >
                      View store page
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

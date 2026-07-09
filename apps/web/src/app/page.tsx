import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { getHomePage } from "@/lib/strapi/homePage";
import { getMediaUrl } from "@/lib/strapi/media";

export const dynamic = "force-dynamic";

export default async function Home() {
  const page = await getHomePage();
  const heroImageUrl = getMediaUrl(page.heroImage?.url);

  return (
    <>
      <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-primary text-white">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={page.heroImage?.alternativeText ?? page.heroTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-hero-overlay-start)_0%,var(--color-hero-overlay-mid)_38%,var(--color-hero-overlay-end)_72%)]" />

        <Container className="relative flex min-h-[calc(100dvh-4rem)] items-center py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {page.heroEyebrow}
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              {page.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#f5e7d3]">
              {page.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {page.heroPrimaryCtaLabel && page.heroPrimaryCtaHref ? (
                <Link
                  href={page.heroPrimaryCtaHref}
                  className="inline-flex h-12 items-center justify-center rounded bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:bg-[var(--color-accent-hover)]"
                >
                  {page.heroPrimaryCtaLabel}
                </Link>
              ) : null}
              {page.heroSecondaryCtaLabel && page.heroSecondaryCtaHref ? (
                <Link
                  href={page.heroSecondaryCtaHref}
                  className="inline-flex h-12 items-center justify-center rounded border border-white/40 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {page.heroSecondaryCtaLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 text-foreground">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                {page.featuresEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {page.featuresTitle}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {page.features.map((item) => (
                <article
                  key={item.title}
                  className="rounded border border-border bg-card p-5 shadow-sm"
                >
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-secondary py-14 text-secondary-foreground">
        <Container className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {page.nextTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {page.nextText}
            </p>
          </div>
          {page.nextCtaLabel && page.nextCtaHref ? (
            <Link
              href={page.nextCtaHref}
              className="inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-[var(--color-primary-hover)]"
            >
              {page.nextCtaLabel}
            </Link>
          ) : null}
        </Container>
      </section>
    </>
  );
}

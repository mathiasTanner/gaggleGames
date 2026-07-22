import Image from "next/image";
import Container from "@/components/layout/Container";
import ContentBlocks from "@/components/content/ContentBlocks";
import { getAboutPage } from "@/lib/strapi/aboutPage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getAboutPage();

  return {
    title: `${page.title} | Gaggle Game`,
    description: page.subtitle,
  };
}

export default async function AboutPage() {
  const page = await getAboutPage();

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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-hero-overlay-start)_0%,var(--color-hero-overlay-mid)_46%,var(--color-hero-overlay-end)_78%)]" />

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
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";

const featuredValues = [
  {
    title: "Table-first design",
    text: "Games built for real groups: quick to teach, satisfying to replay, and easy to bring out again.",
  },
  {
    title: "Swiss-minded quality",
    text: "Clean rules, durable components, and a quiet obsession with getting the little things right.",
  },
  {
    title: "Store ready",
    text: "The storefront foundation is already aligned with the Stripe-enabled project base.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-[#132a2e] text-white">
        <Image
          src="/gaggle-game-hero.png"
          alt="Board game pieces, cards, dice, and tokens on a warm tabletop"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-hero-overlay-start)_0%,var(--color-hero-overlay-mid)_38%,var(--color-hero-overlay-end)_72%)]" />

        <Container className="relative flex min-h-[calc(100dvh-4rem)] items-center py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffd166]">
              Board games for lively tables
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Games worth gathering around.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#f5e7d3]">
              Gaggle Game creates and curates board games that make the room
              brighter: smart turns, warm competition, and stories that survive
              the final score.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/store"
                className="inline-flex h-12 items-center justify-center rounded bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:bg-[var(--color-accent-hover)]"
              >
                Visit the store
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded border border-white/40 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Meet the studio
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 text-foreground">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                First foundations
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                A storefront base with room for the full catalogue.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {featuredValues.map((item) => (
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
              Next up: news, about us, and store pages.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              This first pass keeps the public shell production-minded while
              leaving CMS content models and product logic cleanly separated for
              the next implementation steps.
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-[var(--color-primary-hover)]"
          >
            Preview news
          </Link>
        </Container>
      </section>
    </>
  );
}

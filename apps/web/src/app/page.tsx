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
      <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-[#20160f] text-white">
        <Image
          src="/gaggle-game-hero.png"
          alt="Board game pieces, cards, dice, and tokens on a warm tabletop"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(19,42,46,0.94)_0%,rgba(19,42,46,0.76)_38%,rgba(19,42,46,0.18)_72%)]" />

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
                className="inline-flex h-12 items-center justify-center rounded bg-[#ffd166] px-6 text-sm font-bold text-[#18212f] transition hover:bg-[#ffe19a]"
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

      <section className="bg-white py-16 text-[#18212f]">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#087f8c]">
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
                  className="rounded border border-[#d9e5e2] bg-[#f8fbfa] p-5 shadow-sm"
                >
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#596579]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#eef6f4] py-14 text-[#18212f]">
        <Container className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Next up: news, about us, and store pages.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#596579]">
              This first pass keeps the public shell production-minded while
              leaving CMS content models and product logic cleanly separated for
              the next implementation steps.
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex h-11 items-center justify-center rounded bg-[#087f8c] px-5 text-sm font-semibold text-white transition hover:bg-[#066a75]"
          >
            Preview news
          </Link>
        </Container>
      </section>
    </>
  );
}

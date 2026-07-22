import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { formatNewsDate, getNewsArticles } from "@/lib/strapi/news";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "News | Gaggle Game",
  description: "Latest updates from Gaggle Game.",
};

export default async function NewsPage() {
  const articles = await getNewsArticles();

  return (
    <Container className="py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          News
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Notes from the Gaggle Game table.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Announcements, design notes, product updates, and behind-the-scenes
          progress managed from Strapi.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="group overflow-hidden rounded border border-border bg-card text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[16/10] bg-secondary">
              {article.cover ? (
                <Image
                  src={article.cover.url}
                  alt={article.cover.alternativeText || article.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition group-hover:scale-[1.02]"
                />
              ) : null}
            </div>
            <article className="p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {article.category?.name ? <span>{article.category.name}</span> : null}
                {article.publishedOn ? (
                  <time dateTime={article.publishedOn}>
                    {formatNewsDate(article.publishedOn)}
                  </time>
                ) : null}
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">
                {article.title}
              </h2>
              {article.description ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {article.description}
                </p>
              ) : null}
              <span className="mt-5 inline-flex text-sm font-semibold text-foreground">
                Read article
              </span>
            </article>
          </Link>
        ))}
      </div>
    </Container>
  );
}

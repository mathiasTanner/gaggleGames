import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import ContentBlocks from "@/components/content/ContentBlocks";
import {
  formatNewsDate,
  getNewsArticleBySlug,
  getNewsArticles,
} from "@/lib/strapi/news";

export const dynamic = "force-dynamic";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) return {};

  return {
    title: `${article.title} | Gaggle Game`,
    description: article.description,
  };
}

export async function generateStaticParams() {
  const articles = await getNewsArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) notFound();

  return (
    <Container className="py-10">
      <div className="mb-6">
        <Link
          href="/news"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          Back to news
        </Link>
      </div>

      <article className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {article.category?.name ? <span>{article.category.name}</span> : null}
          {article.publishedOn ? (
            <time dateTime={article.publishedOn}>
              {formatNewsDate(article.publishedOn)}
            </time>
          ) : null}
          {article.author?.name ? <span>{article.author.name}</span> : null}
        </div>

        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {article.title}
        </h1>

        {article.description ? (
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {article.description}
          </p>
        ) : null}

        {article.cover ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded border border-border bg-secondary">
            <Image
              src={article.cover.url}
              alt={article.cover.alternativeText || article.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-8">
          <ContentBlocks blocks={article.blocks} />
        </div>
      </article>
    </Container>
  );
}

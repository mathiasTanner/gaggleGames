import { normalizeBlocks, type ContentBlock } from "./blocks";
import { getMediaUrl } from "./media";
import { asArray, asRecord, asString } from "./normalize";
import { strapiFetch } from "./strapiFetch";

export type NewsArticle = {
  documentId?: string;
  title: string;
  description: string;
  slug: string;
  publishedOn: string;
  cover?: {
    url: string;
    alternativeText?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  author?: {
    name: string;
  };
  blocks: ContentBlock[];
};

type StrapiArticlesResponse = {
  data?: unknown;
};

export const fallbackArticles: NewsArticle[] = [
  {
    title: "Gaggle Game opens the table",
    description:
      "A first note from the studio as the Gaggle Game storefront takes shape.",
    slug: "gaggle-game-opens-the-table",
    publishedOn: "2026-07-22",
    cover: {
      url: "/gaggle-game-hero.png",
      alternativeText: "Board game pieces, cards, dice, and tokens on a warm tabletop",
    },
    category: {
      name: "Studio",
      slug: "studio",
    },
    blocks: [
      {
        type: "rich-text",
        body: "This first news entry is fallback content. Create and publish News Article entries in Strapi to replace it with real updates.",
      },
    ],
  },
];

function unwrapEntry(value: unknown) {
  const record = asRecord(value);
  const attributes = asRecord(record.attributes);
  return { ...record, ...attributes };
}

function normalizeRelation(value: unknown) {
  const record = asRecord(value);
  const data = asRecord(record.data);
  return unwrapEntry(Object.keys(data).length > 0 ? data : value);
}

function normalizeCover(value: unknown) {
  const raw = normalizeRelation(value);
  const url = getMediaUrl(asString(raw.url));
  if (!url) return undefined;

  return {
    url,
    alternativeText: asString(raw.alternativeText),
  };
}

function normalizeArticle(value: unknown): NewsArticle | null {
  const raw = unwrapEntry(value);
  const title = asString(raw.title);
  const slug = asString(raw.slug);

  if (!title || !slug) return null;

  const category = normalizeRelation(raw.category);
  const author = normalizeRelation(raw.author);

  return {
    documentId: asString(raw.documentId, undefined),
    title,
    slug,
    description: asString(raw.description),
    publishedOn: asString(raw.publishedOn, asString(raw.publishedAt)),
    cover: normalizeCover(raw.cover),
    category: asString(category.name)
      ? {
          name: asString(category.name),
          slug: asString(category.slug),
        }
      : undefined,
    author: asString(author.name)
      ? {
          name: asString(author.name),
        }
      : undefined,
    blocks: normalizeBlocks(raw.blocks),
  };
}

function normalizeArticles(json: StrapiArticlesResponse): NewsArticle[] {
  return asArray(json.data)
    .map((item) => normalizeArticle(item))
    .filter((article): article is NewsArticle => Boolean(article));
}

export function formatNewsDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  try {
    const json = await strapiFetch<StrapiArticlesResponse>(
      "/articles?sort=publishedOn:desc,publishedAt:desc&populate[cover]=*&populate[category]=*&populate[author]=*&populate[blocks][populate]=*",
      { revalidate: 60 }
    );
    const articles = normalizeArticles(json);
    return articles.length > 0 ? articles : fallbackArticles;
  } catch {
    return fallbackArticles;
  }
}

export async function getNewsArticleBySlug(
  slug: string
): Promise<NewsArticle | null> {
  try {
    const json = await strapiFetch<StrapiArticlesResponse>(
      `/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[cover]=*&populate[category]=*&populate[author]=*&populate[blocks][populate]=*`,
      { revalidate: 60 }
    );
    return normalizeArticles(json)[0] ?? null;
  } catch {
    return fallbackArticles.find((article) => article.slug === slug) ?? null;
  }
}

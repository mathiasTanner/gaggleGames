import {
  asArray,
  asRecord,
  asString,
  unwrapMedia,
} from "@/lib/strapi/normalize";
import { getMediaUrl } from "@/lib/strapi/media";
import { strapiFetch } from "@/lib/strapi/strapiFetch";

export type StockStatus = "in_stock" | "preorder" | "sold_out";

export type ProductImage = {
  url: string;
  alternativeText?: string;
};

export type Product = {
  documentId?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage?: ProductImage;
  gallery: ProductImage[];
  priceCents: number;
  currency: string;
  isActive: boolean;
  featured: boolean;
  stockStatus: StockStatus;
  stripePriceId?: string;
};

type StrapiProductsResponse = {
  data?: unknown;
};

export const fallbackProduct: Product = {
  title: "Gaggle Game Starter Box",
  slug: "gaggle-game-starter-box",
  shortDescription:
    "A lively board game box for clever turns, loud tables, and memorable game nights.",
  description:
    "The first Gaggle Game sample product for testing the store and Stripe checkout flow.",
  coverImage: {
    url: "/gaggle-game-hero.png",
    alternativeText: "Board game pieces, cards, dice, and tokens on a warm tabletop",
  },
  gallery: [],
  priceCents: 3900,
  currency: "CHF",
  isActive: true,
  featured: true,
  stockStatus: "in_stock",
};

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeStockStatus(value: unknown): StockStatus {
  const status = asString(value);
  if (status === "preorder" || status === "sold_out") return status;
  return "in_stock";
}

function unwrapEntry(value: unknown) {
  const record = asRecord(value);
  const attributes = asRecord(record.attributes);
  return { ...record, ...attributes };
}

function normalizeImage(value: unknown): ProductImage | undefined {
  const media = unwrapMedia(value);
  const url = getMediaUrl(asString(media?.url));
  if (!url) return undefined;

  return {
    url,
    alternativeText: asString(media?.alternativeText),
  };
}

function normalizeGallery(value: unknown): ProductImage[] {
  const record = asRecord(value);
  const data = record.data;
  const items = Array.isArray(data) ? data : asArray(value);

  return items
    .map((item) => normalizeImage(item))
    .filter((image): image is ProductImage => Boolean(image));
}

function normalizeProduct(value: unknown): Product | null {
  const raw = unwrapEntry(value);
  const title = asString(raw.title);
  const slug = asString(raw.slug);

  if (!title || !slug) return null;

  return {
    documentId: asString(raw.documentId, undefined),
    title,
    slug,
    shortDescription: asString(raw.shortDescription),
    description: asString(raw.description),
    coverImage: normalizeImage(raw.coverImage),
    gallery: normalizeGallery(raw.gallery),
    priceCents: asNumber(raw.priceCents),
    currency: asString(raw.currency, "CHF").toUpperCase(),
    isActive: asBoolean(raw.isActive, true),
    featured: asBoolean(raw.featured),
    stockStatus: normalizeStockStatus(raw.stockStatus),
    stripePriceId: asString(raw.stripePriceId, undefined),
  };
}

function normalizeProducts(json: StrapiProductsResponse): Product[] {
  return asArray(json.data)
    .map((item) => normalizeProduct(item))
    .filter((product): product is Product => Boolean(product));
}

export function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export function getStockLabel(stockStatus: StockStatus) {
  if (stockStatus === "preorder") return "Preorder";
  if (stockStatus === "sold_out") return "Sold out";
  return "In stock";
}

export function isPurchasable(product: Product) {
  return product.isActive && product.stockStatus !== "sold_out";
}

export async function getProducts(): Promise<Product[]> {
  try {
    const json = await strapiFetch<StrapiProductsResponse>(
      "/products?filters[isActive][$eq]=true&sort=featured:desc,title:asc&populate=*",
      { revalidate: 60 }
    );
    const products = normalizeProducts(json);
    return products.length > 0 ? products : [fallbackProduct];
  } catch {
    return [fallbackProduct];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const json = await strapiFetch<StrapiProductsResponse>(
      `/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
      { revalidate: 60 }
    );
    return normalizeProducts(json)[0] ?? null;
  } catch {
    return slug === fallbackProduct.slug ? fallbackProduct : null;
  }
}

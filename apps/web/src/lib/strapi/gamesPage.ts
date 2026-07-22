import { normalizeBlocks, type ContentBlock } from "./blocks";
import { getMediaUrl } from "./media";
import { asString, unwrapData, unwrapMedia } from "./normalize";
import { strapiFetch } from "./strapiFetch";

export type GamesPage = {
  eyebrow: string;
  title: string;
  subtitle: string;
  heroImage?: {
    url: string;
    alternativeText?: string;
  };
  introTitle: string;
  introText: string;
  featuredProductsTitle: string;
  featuredProductsText: string;
  blocks: ContentBlock[];
};

type StrapiGamesPageResponse = {
  data?: unknown;
};

export const fallbackGamesPage: GamesPage = {
  eyebrow: "Games",
  title: "Board games made for lively tables.",
  subtitle:
    "Explore the Gaggle Game catalogue: approachable, social, and tuned for the kind of moments people retell later.",
  heroImage: {
    url: "/gaggle-game-hero.png",
    alternativeText: "Board game pieces, cards, dice, and tokens on a warm tabletop",
  },
  introTitle: "Designed for repeat game nights.",
  introText:
    "This page introduces the games and the thinking behind them. The store handles checkout, while this space can stay focused on gameplay, audience, and what makes each box special.",
  featuredProductsTitle: "Available games",
  featuredProductsText:
    "These products come from Strapi and link directly to the checkout-ready store pages.",
  blocks: [],
};

function normalizeGamesPage(json: StrapiGamesPageResponse): GamesPage {
  const raw = unwrapData(json);
  const heroImage = unwrapMedia(raw.heroImage);
  const heroImageUrl = getMediaUrl(asString(heroImage?.url));

  return {
    eyebrow: asString(raw.eyebrow),
    title: asString(raw.title),
    subtitle: asString(raw.subtitle),
    heroImage: heroImageUrl
      ? {
          url: heroImageUrl,
          alternativeText: asString(heroImage?.alternativeText),
        }
      : undefined,
    introTitle: asString(raw.introTitle),
    introText: asString(raw.introText),
    featuredProductsTitle: asString(raw.featuredProductsTitle),
    featuredProductsText: asString(raw.featuredProductsText),
    blocks: normalizeBlocks(raw.blocks),
  };
}

export async function getGamesPage(): Promise<GamesPage> {
  try {
    const json = await strapiFetch<StrapiGamesPageResponse>(
      "/games-page?populate[heroImage]=*&populate[blocks][populate]=*",
      { revalidate: 60 }
    );
    return normalizeGamesPage(json);
  } catch {
    return fallbackGamesPage;
  }
}

import { normalizeBlocks, type ContentBlock } from "./blocks";
import { getMediaUrl } from "./media";
import { asString, unwrapData, unwrapMedia } from "./normalize";
import { strapiFetch } from "./strapiFetch";

export type AboutPage = {
  eyebrow: string;
  title: string;
  subtitle: string;
  heroImage?: {
    url: string;
    alternativeText?: string;
  };
  introTitle: string;
  introText: string;
  blocks: ContentBlock[];
};

type StrapiAboutResponse = {
  data?: unknown;
};

export const fallbackAboutPage: AboutPage = {
  eyebrow: "About Gaggle Game",
  title: "A small studio for games that bring the table to life.",
  subtitle:
    "We design and curate board games for people who like clever decisions, approachable rules, and stories that keep going after the box closes.",
  heroImage: {
    url: "/gaggle-game-hero.png",
    alternativeText: "Board game pieces, cards, dice, and tokens on a warm tabletop",
  },
  introTitle: "Built around the joy of gathering.",
  introText:
    "Gaggle Game is starting with a focused catalogue and a simple promise: every game should be easy to bring to the table, satisfying to replay, and sturdy enough to become part of the ritual.",
  blocks: [],
};

function normalizeAboutPage(json: StrapiAboutResponse): AboutPage {
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
    blocks: normalizeBlocks(raw.blocks),
  };
}

export async function getAboutPage(): Promise<AboutPage> {
  try {
    const json = await strapiFetch<StrapiAboutResponse>(
      "/about?populate=*",
      { revalidate: 60 }
    );
    return normalizeAboutPage(json);
  } catch {
    return fallbackAboutPage;
  }
}

import {
  asArray,
  asRecord,
  asString,
  unwrapData,
  unwrapMedia,
} from "./normalize";
import { strapiFetch } from "./strapiFetch";

export type HomeFeature = {
  title: string;
  text: string;
};

export type HomePage = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  heroImage?: {
    url: string;
    alternativeText?: string;
  };
  featuresEyebrow: string;
  featuresTitle: string;
  features: HomeFeature[];
  nextTitle: string;
  nextText: string;
  nextCtaLabel: string;
  nextCtaHref: string;
};

export const fallbackHomePage: HomePage = {
  heroEyebrow: "Board games for lively tables",
  heroTitle: "Games worth gathering around.",
  heroSubtitle:
    "Gaggle Game creates and curates board games that make the room brighter: smart turns, warm competition, and stories that survive the final score.",
  heroPrimaryCtaLabel: "Visit the store",
  heroPrimaryCtaHref: "/store",
  heroSecondaryCtaLabel: "Meet the studio",
  heroSecondaryCtaHref: "/about",
  heroImage: {
    url: "/gaggle-game-hero.png",
    alternativeText: "Board game pieces, cards, dice, and tokens on a warm tabletop",
  },
  featuresEyebrow: "First foundations",
  featuresTitle: "A storefront base with room for the full catalogue.",
  features: [
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
  ],
  nextTitle: "Next up: news, about us, and store pages.",
  nextText:
    "This first pass keeps the public shell production-minded while leaving CMS content models and product logic cleanly separated for the next implementation steps.",
  nextCtaLabel: "Preview news",
  nextCtaHref: "/news",
};

type StrapiHomePageResponse = {
  data?: unknown;
};

function normalizeHomePage(json: StrapiHomePageResponse): HomePage {
  const raw = unwrapData(json);
  const heroImage = unwrapMedia(raw.heroImage);
  const features = asArray(raw.features)
    .map((feature) => {
      const record = asRecord(feature);
      return {
        title: asString(record.title),
        text: asString(record.text),
      };
    })
    .filter((feature) => feature.title);

  return {
    heroEyebrow: asString(raw.heroEyebrow, fallbackHomePage.heroEyebrow),
    heroTitle: asString(raw.heroTitle, fallbackHomePage.heroTitle),
    heroSubtitle: asString(raw.heroSubtitle, fallbackHomePage.heroSubtitle),
    heroPrimaryCtaLabel: asString(
      raw.heroPrimaryCtaLabel,
      fallbackHomePage.heroPrimaryCtaLabel
    ),
    heroPrimaryCtaHref: asString(
      raw.heroPrimaryCtaHref,
      fallbackHomePage.heroPrimaryCtaHref
    ),
    heroSecondaryCtaLabel: asString(
      raw.heroSecondaryCtaLabel,
      fallbackHomePage.heroSecondaryCtaLabel
    ),
    heroSecondaryCtaHref: asString(
      raw.heroSecondaryCtaHref,
      fallbackHomePage.heroSecondaryCtaHref
    ),
    heroImage: heroImage
      ? {
          url: asString(heroImage.url),
          alternativeText: asString(heroImage.alternativeText),
        }
      : fallbackHomePage.heroImage,
    featuresEyebrow: asString(raw.featuresEyebrow, fallbackHomePage.featuresEyebrow),
    featuresTitle: asString(raw.featuresTitle, fallbackHomePage.featuresTitle),
    features: features.length > 0 ? features : fallbackHomePage.features,
    nextTitle: asString(raw.nextTitle, fallbackHomePage.nextTitle),
    nextText: asString(raw.nextText, fallbackHomePage.nextText),
    nextCtaLabel: asString(raw.nextCtaLabel, fallbackHomePage.nextCtaLabel),
    nextCtaHref: asString(raw.nextCtaHref, fallbackHomePage.nextCtaHref),
  };
}

export async function getHomePage(): Promise<HomePage> {
  try {
    const json = await strapiFetch<StrapiHomePageResponse>("/home?populate=*", {
      revalidate: 60,
    });
    return normalizeHomePage(json);
  } catch {
    return fallbackHomePage;
  }
}

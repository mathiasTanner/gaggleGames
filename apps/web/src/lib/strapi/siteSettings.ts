import { asString, unwrapData, unwrapMedia } from "./normalize";
import { strapiFetch } from "./strapiFetch";

export type SiteSettings = {
  siteName: string;
  logo?: {
    url: string;
    alternativeText?: string;
  };
  favicon?: {
    url: string;
  };
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  headerCtaLabel: string;
  headerCtaHref: string;
};

export const fallbackSiteSettings: SiteSettings = {
  siteName: "Gaggle Game",
  defaultSeoTitle: "Gaggle Game",
  defaultSeoDescription:
    "A board game studio and shop for lively tables, clever turns, and memorable game nights.",
  headerCtaLabel: "Shop",
  headerCtaHref: "/store",
};

type StrapiSiteSettingsResponse = {
  data?: unknown;
};

function normalizeSiteSettings(json: StrapiSiteSettingsResponse): SiteSettings {
  const raw = unwrapData(json);
  const logo = unwrapMedia(raw.logo);
  const favicon = unwrapMedia(raw.favicon);

  return {
    siteName: asString(raw.siteName, fallbackSiteSettings.siteName),
    logo: logo
      ? {
          url: asString(logo.url),
          alternativeText: asString(
            logo.alternativeText,
            asString(raw.logoAlt, fallbackSiteSettings.siteName)
          ),
        }
      : undefined,
    favicon: favicon ? { url: asString(favicon.url) } : undefined,
    defaultSeoTitle: asString(
      raw.defaultSeoTitle,
      fallbackSiteSettings.defaultSeoTitle
    ),
    defaultSeoDescription: asString(
      raw.defaultSeoDescription,
      fallbackSiteSettings.defaultSeoDescription
    ),
    headerCtaLabel: asString(
      raw.headerCtaLabel,
      fallbackSiteSettings.headerCtaLabel
    ),
    headerCtaHref: asString(raw.headerCtaHref, fallbackSiteSettings.headerCtaHref),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const json = await strapiFetch<StrapiSiteSettingsResponse>(
      "/site-setting?populate=*",
      { revalidate: 60 }
    );
    return normalizeSiteSettings(json);
  } catch {
    return fallbackSiteSettings;
  }
}

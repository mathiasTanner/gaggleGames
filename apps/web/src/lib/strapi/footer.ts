import { asArray, asRecord, asString, unwrapData } from "./normalize";
import { strapiFetch } from "./strapiFetch";

export type FooterLink = {
  label: string;
  href: string;
};

export type SiteFooter = {
  brandName: string;
  tagline: string;
  copyrightText: string;
  links: FooterLink[];
};

export const fallbackFooter: SiteFooter = {
  brandName: "Gaggle Game",
  tagline:
    "Board games for loud tables, clever turns, and the kind of evenings people keep talking about after the box is closed.",
  copyrightText: `Copyright ${new Date().getFullYear()} Gaggle Game. All rights reserved.`,
  links: [
    { label: "News", href: "/news" },
    { label: "About us", href: "/about" },
    { label: "Store", href: "/store" },
    { label: "Contact", href: "/contact" },
  ],
};

type StrapiFooterResponse = {
  data?: unknown;
};

function normalizeFooter(json: StrapiFooterResponse): SiteFooter {
  const raw = unwrapData(json);
  const links = asArray(raw.links)
    .map((link) => {
      const record = asRecord(link);
      return {
        label: asString(record.label),
        href: asString(record.href),
      };
    })
    .filter((link) => link.label && link.href);

  return {
    brandName: asString(raw.brandName, fallbackFooter.brandName),
    tagline: asString(raw.tagline, fallbackFooter.tagline),
    copyrightText: asString(raw.copyrightText, fallbackFooter.copyrightText),
    links: links.length > 0 ? links : fallbackFooter.links,
  };
}

export async function getSiteFooter(): Promise<SiteFooter> {
  try {
    const json = await strapiFetch<StrapiFooterResponse>(
      "/site-footer?populate[links]=*",
      { revalidate: 60 }
    );
    return normalizeFooter(json);
  } catch {
    return fallbackFooter;
  }
}

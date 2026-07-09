import { asArray, asRecord, asString, unwrapData } from "./normalize";
import { strapiFetch } from "./strapiFetch";

export type NavLink = { label: string; href: string };
export type NavItem = { label: string; href?: string; children: NavLink[] };

export const fallbackNavigation: NavItem[] = [
  { label: "Games", href: "/games", children: [] },
  { label: "News", href: "/news", children: [] },
  { label: "About", href: "/about", children: [] },
  { label: "Store", href: "/store", children: [] },
];

type StrapiNavigationResponse = {
  data?: unknown;
  items?: unknown;
};

function normalizeNavigation(json: StrapiNavigationResponse): NavItem[] {
  const raw = unwrapData(json);
  const items = asArray(raw.items ?? json.items);

  const normalized = items
    .map((item) => {
      const record = asRecord(item);
      const children = asArray(record.children)
        .map((child) => {
          const childRecord = asRecord(child);
          return {
            label: asString(childRecord.label),
            href: asString(childRecord.href),
          };
        })
        .filter((child) => child.label && child.href);

      const href = asString(record.href);

      return {
        label: asString(record.label),
        href: href || undefined,
        children,
      };
    })
    .filter((item) => item.label);

  return normalized.length > 0 ? normalized : fallbackNavigation;
}

export async function getNavigation(): Promise<NavItem[]> {
  try {
    const json = await strapiFetch<StrapiNavigationResponse>(
      "/navigation?populate[items][populate][children]=*",
      { revalidate: 60 }
    );
    return normalizeNavigation(json);
  } catch {
    return fallbackNavigation;
  }
}

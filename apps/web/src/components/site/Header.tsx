import Link from "next/link";
import CartLink from "@/components/cart/CartLink";
import Container from "@/components/layout/Container";
import BrandMark from "@/components/site/BrandMark";
import MobileHeader from "@/components/site/MobileHeader";
import ThemeToggle from "@/components/site/ThemeToggle";
import { getMediaUrl } from "@/lib/strapi/media";
import { getNavigation } from "@/lib/strapi/navigation";
import { getSiteSettings } from "@/lib/strapi/siteSettings";

export default async function Header() {
  const [items, siteSettings] = await Promise.all([
    getNavigation(),
    getSiteSettings(),
  ]);
  const logoUrl = getMediaUrl(siteSettings.logo?.url);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 text-card-foreground backdrop-blur">
      <Container className="py-2">
        <MobileHeader
          items={items}
          logoUrl={logoUrl}
          logoAlt={siteSettings.logo?.alternativeText}
          siteName={siteSettings.siteName}
        />

        <div className="hidden min-h-14 items-center justify-between gap-4 md:flex">
          <BrandMark
            logoUrl={logoUrl}
            logoAlt={siteSettings.logo?.alternativeText}
            siteName={siteSettings.siteName}
          />

          <nav className="flex flex-1 items-center justify-center gap-5 whitespace-nowrap text-sm font-medium">
            {items.map((item) => (
              <Link
                key={item.href ?? item.label}
                href={item.href ?? "#"}
                className="rounded px-2 py-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <CartLink />
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}

import Link from "next/link";
import Container from "@/components/layout/Container";
import BrandMark from "@/components/site/BrandMark";
import { getSiteFooter } from "@/lib/strapi/footer";
import { getMediaUrl } from "@/lib/strapi/media";
import { getSiteSettings } from "@/lib/strapi/siteSettings";

export default async function Footer() {
  const [footer, siteSettings] = await Promise.all([
    getSiteFooter(),
    getSiteSettings(),
  ]);
  const logoUrl = getMediaUrl(siteSettings.logo?.url);

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <Container className="grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <BrandMark
            logoUrl={logoUrl}
            logoAlt={siteSettings.logo?.alternativeText}
            siteName={footer.brandName}
          />
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            {footer.tagline}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground md:justify-end">
          {footer.links.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="text-xs text-muted-foreground md:col-span-2">
          {footer.copyrightText}
        </div>
      </Container>
    </footer>
  );
}

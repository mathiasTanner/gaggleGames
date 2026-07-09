"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/lib/strapi/navigation";
import BrandMark from "@/components/site/BrandMark";
import MobileNav from "@/components/site/MobileNav";
import ThemeToggle from "@/components/site/ThemeToggle";

type MobileHeaderProps = {
  items: NavItem[];
  logoUrl?: string;
  logoAlt?: string;
  siteName: string;
};

export default function MobileHeader({
  items,
  logoUrl,
  logoAlt,
  siteName,
}: MobileHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between gap-4">
        <BrandMark logoUrl={logoUrl} logoAlt={logoAlt} siteName={siteName} />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileNav
            menuOpen={menuOpen}
            onToggle={() => setMenuOpen((open) => !open)}
          />
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          className="mt-3 flex flex-col gap-1 border-t border-border pt-3"
        >
          {items.map((item) => (
            <Link
              key={item.href ?? item.label}
              href={item.href ?? "#"}
              className="rounded px-2 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

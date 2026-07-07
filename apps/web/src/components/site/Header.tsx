import Link from "next/link";
import Container from "@/components/layout/Container";
import BrandMark from "@/components/site/BrandMark";
import MobileHeader from "@/components/site/MobileHeader";
import ThemeToggle from "@/components/site/ThemeToggle";
import { mainNavigation } from "@/components/site/navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 text-card-foreground backdrop-blur">
      <Container className="py-2">
        <MobileHeader items={mainNavigation} />

        <div className="hidden min-h-14 items-center justify-between gap-4 md:flex">
          <BrandMark />

          <nav className="flex flex-1 items-center justify-center gap-5 whitespace-nowrap text-sm font-medium">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-2 py-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/store"
              className="inline-flex h-10 items-center justify-center rounded bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:bg-[var(--color-accent-hover)]"
            >
              Shop
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}

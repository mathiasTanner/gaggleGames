import Link from "next/link";
import Container from "@/components/layout/Container";
import BrandMark from "@/components/site/BrandMark";
import { footerNavigation } from "@/components/site/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <Container className="grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Board games for loud tables, clever turns, and the kind of evenings
            people keep talking about after the box is closed.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground md:justify-end">
          {footerNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="text-xs text-muted-foreground md:col-span-2">
          Copyright {new Date().getFullYear()} Gaggle Game. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

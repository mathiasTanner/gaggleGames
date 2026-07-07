import Link from "next/link";
import Container from "@/components/layout/Container";

const navItems = [
  { label: "Games", href: "/games" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
  { label: "Store", href: "/store" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 text-[#18212f] backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="grid size-10 place-items-center rounded bg-[#087f8c] text-lg font-black text-white">
            GG
          </span>
          <span className="text-lg tracking-tight">Gaggle Game</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#596579] transition hover:text-[#18212f]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/store"
          className="inline-flex h-10 items-center justify-center rounded bg-[#f45d48] px-4 text-sm font-semibold text-white transition hover:bg-[#d94431]"
        >
          Shop
        </Link>
      </Container>
    </header>
  );
}

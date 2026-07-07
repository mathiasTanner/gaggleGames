import Link from "next/link";
import Container from "@/components/layout/Container";

const footerLinks = [
  { label: "News", href: "/news" },
  { label: "About us", href: "/about" },
  { label: "Store", href: "/store" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#132a2e] text-white">
      <Container className="grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <div className="text-lg font-semibold tracking-tight">Gaggle Game</div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#cce7e2]">
            Board games for loud tables, clever turns, and the kind of evenings
            people keep talking about after the box is closed.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#cce7e2] md:justify-end">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="text-xs text-[#a9cbc6] md:col-span-2">
          Copyright {new Date().getFullYear()} Gaggle Game. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

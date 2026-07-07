export type NavItem = {
  label: string;
  href: string;
};

export const mainNavigation: NavItem[] = [
  { label: "Games", href: "/games" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
  { label: "Store", href: "/store" },
];

export const footerNavigation: NavItem[] = [
  { label: "News", href: "/news" },
  { label: "About us", href: "/about" },
  { label: "Store", href: "/store" },
  { label: "Contact", href: "/contact" },
];

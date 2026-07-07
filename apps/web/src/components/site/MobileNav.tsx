"use client";

import { Menu, X } from "lucide-react";

type MobileNavProps = {
  menuOpen: boolean;
  onToggle: () => void;
};

export default function MobileNav({ menuOpen, onToggle }: MobileNavProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-grid size-10 place-items-center rounded text-card-foreground transition hover:bg-muted md:hidden"
      aria-label="Open navigation menu"
      aria-expanded={menuOpen}
      aria-controls="mobile-nav"
    >
      {menuOpen ? (
        <X className="size-5" aria-hidden="true" />
      ) : (
        <Menu className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}

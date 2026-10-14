"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

type Item = { href: string; label: string };

/** Hamburger menu for small screens; shared by the site header and the landing nav. */
export function MobileMenu({
  items,
  className,
}: {
  items: readonly Item[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-sm"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-50 flex flex-col gap-2 border-b bg-background px-5 py-5 text-foreground shadow-lg"
        >
          {/* Any link click closes the menu. */}
          <nav
            aria-label="Main"
            className="flex flex-col"
            onClick={() => setOpen(false)}
          >
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="py-3 text-base">
                {item.label}
              </Link>
            ))}
            <Link href="/list" className="py-3 text-base text-primary">
              Become a provider
            </Link>
          </nav>
          <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
            Theme
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}

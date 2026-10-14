"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { AreaPicker } from "@/components/area/AreaPicker";
import { cn } from "@/lib/utils";

import { NAV_ITEMS, isActive } from "./nav";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="grid size-9 place-items-center rounded-md hover:bg-white/10"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-16 flex flex-col gap-4 border-b border-white/10 bg-ink px-4 py-6"
        >
          {/* Any link click inside closes the menu. */}
          <nav aria-label="Main" className="flex flex-col" onClick={() => setOpen(false)}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-2 py-3 text-ink-foreground/80",
                  isActive(pathname, item.href) && "text-ink-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/list" className="rounded-md px-2 py-3 text-primary">
              List something
            </Link>
          </nav>
          <AreaPicker className="[&_select]:flex-1 [&_select]:border-white/15 [&_select]:bg-white/5" />
        </div>
      )}
    </div>
  );
}

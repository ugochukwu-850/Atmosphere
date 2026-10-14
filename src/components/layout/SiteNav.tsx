"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { isNavActive, SITE_NAV } from "./nav";

export function SiteNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={cn("items-center gap-5", className)}>
      {SITE_NAV.map((item) => {
        const active = isNavActive(pathname, item.match);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-[15px] whitespace-nowrap transition-colors",
              "group-data-[tone=dark]/header:text-white/55 group-data-[tone=dark]/header:hover:text-white",
              "group-data-[tone=light]/header:text-charcoal group-data-[tone=light]/header:hover:text-primary",
              active &&
                "group-data-[tone=dark]/header:text-white group-data-[tone=light]/header:text-primary",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

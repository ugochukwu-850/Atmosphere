"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { NAV_ITEMS, isActive } from "./nav";

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={cn("items-center gap-1", className)}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm whitespace-nowrap text-ink-foreground/75 transition-colors hover:text-ink-foreground",
              active && "text-ink-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

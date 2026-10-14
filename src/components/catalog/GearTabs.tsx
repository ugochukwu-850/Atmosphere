import Link from "next/link";

import { cn } from "@/lib/utils";

const TABS = [
  { href: "/gear", label: "Rent by day" },
  { href: "/gear/sale", label: "Buy used gear" },
] as const;

export function GearTabs({ active }: { active: "/gear" | "/gear/sale" }) {
  return (
    <nav aria-label="Gear" className="flex gap-6 border-b">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.href === active ? "page" : undefined}
          className={cn(
            "-mb-px border-b-2 pb-3 text-sm font-medium",
            tab.href === active
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

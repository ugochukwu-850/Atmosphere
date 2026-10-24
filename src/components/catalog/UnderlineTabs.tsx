import Link from "next/link";

import { cn } from "@/lib/utils";

/** "All Places · Bookable Space · Scout-only Places" tabs (rust underline when active). */
export function UnderlineTabs({
  tabs,
  activeKey,
  label,
}: {
  tabs: { key: string; label: string; href: string }[];
  activeKey: string;
  label: string;
}) {
  return (
    <nav aria-label={label} className="flex gap-6 overflow-x-auto">
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b-2 px-1.5 pb-2.5 text-sm whitespace-nowrap transition-colors",
              active
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-charcoal hover:text-primary dark:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

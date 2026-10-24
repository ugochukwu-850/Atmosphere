"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { DASHBOARD_NAV, isDashboardActive } from "./nav";
import { NavIcon } from "./NavIcon";

/** Sidebar links: rust pill on the active page, stone text otherwise. */
export function DashboardNav({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return <NavLinks {...{ pathname, collapsed, onNavigate }} />;
}

/** Rendered without an active item while the pathname suspends. */
export function NavLinks({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname?: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-3">
      {DASHBOARD_NAV.map((item) => {
        const active = pathname ? isDashboardActive(pathname, item) : false;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg py-2.5 text-[13px] transition-colors",
              collapsed ? "justify-center px-0" : "px-5",
              active
                ? "bg-primary text-ivory"
                : "text-stone hover:bg-muted dark:text-muted-foreground",
            )}
          >
            <NavIcon name={item.icon} />
            <span className={cn(collapsed && "sr-only")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

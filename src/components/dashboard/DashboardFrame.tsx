"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState, type ReactNode } from "react";

import { Wordmark } from "@/components/layout/Wordmark";
import { CompactSearch } from "@/components/search/SearchForms";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { DashboardNav, NavLinks } from "./DashboardNav";
import { NavIcon } from "./NavIcon";

const RULE = "border-b-[0.5px] border-sand dark:border-border";

/**
 * Signed-in shell from the Figma Dashboard frames: 316px panel sidebar (rust
 * wordmark, nav, provider promo) and a top bar with the compact search,
 * notifications and the account menu. Below lg the sidebar is a drawer; on
 * desktop its menu button collapses it to an icon rail.
 */
export function DashboardFrame({
  account,
  children,
}: {
  /** Account menu (a server component, streamed in). */
  account: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="flex min-h-dvh">
      {open && (
        <div
          aria-hidden
          onClick={close}
          className="fixed inset-0 z-40 bg-charcoal/40 lg:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[316px] max-w-[85vw] flex-col bg-card transition-transform lg:sticky lg:top-0 lg:h-dvh lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed && "lg:w-[88px]",
        )}
      >
        <div
          className={cn(
            "flex h-[83px] shrink-0 items-center justify-between px-12",
            RULE,
            collapsed && "lg:justify-center lg:px-0",
          )}
        >
          <Wordmark className={cn(collapsed && "lg:hidden")} />
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-controls="dashboard-sidebar"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden size-10 place-items-center rounded-sm text-charcoal hover:bg-muted lg:grid dark:text-foreground"
          >
            <Menu className="size-5" />
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="grid size-10 place-items-center rounded-sm lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className={cn("px-12 pt-[54px]", collapsed && "lg:px-5")}>
            <Suspense fallback={<NavLinks collapsed={collapsed} />}>
              <DashboardNav collapsed={collapsed} onNavigate={close} />
            </Suspense>
          </div>
          <div
            className={cn(
              "mt-auto px-[26px] pt-10 pb-8",
              collapsed && "lg:hidden",
            )}
          >
            <ProviderPromo onNavigate={close} />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          data-tone="light"
          className={cn(
            "group/header sticky top-0 z-30 flex h-[83px] shrink-0 items-center gap-4 bg-background px-5 lg:px-[74px]",
            RULE,
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-controls="dashboard-sidebar"
            aria-expanded={open}
            aria-label="Open menu"
            className="grid size-10 place-items-center rounded-sm lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <Wordmark className="lg:hidden" />
          {/* CompactSearch reads the pathname, which can suspend. */}
          <Suspense
            fallback={<div className="hidden h-11 w-[23rem] md:block" />}
          >
            <CompactSearch className="hidden md:block" />
          </Suspense>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="grid size-10 place-items-center rounded-[10px] text-charcoal hover:bg-muted dark:text-foreground"
            >
              <NavIcon name="bell" className="size-5" />
            </Link>
            {account}
          </div>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

/** Charcoal card at the foot of the sidebar: "Have a space, gear or talent to offer?" */
function ProviderPromo({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-[26px] rounded-xl bg-charcoal p-5 text-ivory dark:bg-muted">
      <div className="flex flex-col gap-2">
        <p className="font-heading text-lg leading-tight font-bold">
          Have a space, gear or talent to offer?
        </p>
        <p className="text-[10px]">
          Bring your creative resource to productions.
        </p>
      </div>
      <Link
        href="/list"
        onClick={onNavigate}
        className={buttonClasses({
          size: "lg",
          className:
            "h-13 w-full rounded-[10px] bg-sand font-heading font-normal text-charcoal hover:bg-sand-800",
        })}
      >
        Set up provider profile
      </Link>
    </div>
  );
}

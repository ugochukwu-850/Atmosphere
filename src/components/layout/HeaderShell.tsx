"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { DARK_HEADER_PATHS } from "./nav";

export type HeaderTone = "dark" | "light";

/** Header frame: charcoal on search pages (joins the dark band), white elsewhere. */
export function HeaderFrame({
  tone,
  children,
}: {
  tone: HeaderTone;
  children: ReactNode;
}) {
  return (
    <header
      data-tone={tone}
      className={cn(
        "group/header relative z-40",
        tone === "dark"
          ? "bg-charcoal text-white"
          : "border-b border-sand/30 bg-background text-foreground",
      )}
    >
      {children}
    </header>
  );
}

export function HeaderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <HeaderFrame tone={DARK_HEADER_PATHS.includes(pathname) ? "dark" : "light"}>
      {children}
    </HeaderFrame>
  );
}

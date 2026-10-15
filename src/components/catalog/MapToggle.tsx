import Link from "next/link";

import { cn } from "@/lib/utils";

/** "Show Map" switch (olive when on). A link, so the server renders the map view. */
export function MapToggle({ on, href }: { on: boolean; href: string }) {
  return (
    <Link
      href={href}
      role="switch"
      aria-checked={on}
      scroll={false}
      className="flex items-center gap-2.5 text-[13px] text-charcoal dark:text-foreground"
    >
      <span
        aria-hidden
        className={cn(
          "relative h-[18px] w-8 rounded-full transition-colors",
          on ? "bg-olive" : "bg-ivory dark:bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-3.5 rounded-full transition-all",
            on ? "left-[16px] bg-white" : "left-0.5 bg-charcoal-600",
          )}
        />
      </span>
      Show Map
    </Link>
  );
}

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const variants = {
  /** "BOOKABLE" on listing photos. */
  bookable: "bg-white text-charcoal",
  /** "SCOUT-ONLY" on listing photos. */
  scout: "bg-olive text-panel",
  neutral: "bg-muted text-muted-foreground",
} as const;

export type BadgeVariant = keyof typeof variants;

/** Status label from the Figma cards: Manrope 800, 10px caps, 4px radius. */
export function Badge({
  variant = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs px-[9px] py-[5px] text-[10px] leading-none font-extrabold tracking-[0.06em] uppercase",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

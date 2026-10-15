import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Cards + Panels fill, 1px border, 16px radius (Figma listing cards, price panel). */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

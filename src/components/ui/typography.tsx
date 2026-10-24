import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Rust caps label above headings ("PLANNER", "ABOUT US", "YOUR NEXT STEP"). */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-base font-medium text-primary uppercase", className)}
      {...props}
    />
  );
}

/** Content column from the 1512px frames: 1366px wide, centred. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1478px] px-5 md:px-10 xl:px-14",
        className,
      )}
      {...props}
    />
  );
}

/** Small dot-separated facts ("● Bookable  ● Yaba Lagos  ● Production Listing"). */
export function DotList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-charcoal/20 dark:bg-white/30"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

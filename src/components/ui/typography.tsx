import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Small uppercase rust label above section headings ("PLANNER"). */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-xs font-semibold tracking-[0.18em] text-primary uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10",
        className,
      )}
      {...props}
    />
  );
}

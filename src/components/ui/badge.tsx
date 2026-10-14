import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const variants = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  ink: "bg-ink text-ink-foreground",
} as const;

export function Badge({
  variant = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

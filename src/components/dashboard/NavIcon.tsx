import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import type { DashboardIcon } from "./nav";

/**
 * Figma icon from public/icons/dashboard, drawn as a mask so it takes the text
 * colour (ivory on the active rust item, Secondary Text otherwise).
 */
export function NavIcon({
  name,
  className,
}: {
  name: DashboardIcon;
  className?: string;
}) {
  const url = `url(/icons/dashboard/${name}.svg)`;
  const style: CSSProperties = {
    maskImage: url,
    WebkitMaskImage: url,
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };
  return (
    <span
      aria-hidden
      style={style}
      className={cn("size-4 shrink-0 bg-current", className)}
    />
  );
}

import Link from "next/link";

import { cn } from "@/lib/utils";

/** Grid / map switch, stored in `?view=`. */
export function ViewToggle({
  basePath,
  view,
  params = {},
}: {
  basePath: string;
  view: "grid" | "map";
  params?: Record<string, string | undefined>;
}) {
  const href = (next: "grid" | "map") => {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries({
      ...params,
      view: next === "map" ? "map" : undefined,
    })) {
      if (v) search.set(k, v);
    }
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div
      role="group"
      aria-label="View"
      className="inline-flex rounded-lg border bg-background p-1 text-sm"
    >
      {(["grid", "map"] as const).map((option) => (
        <Link
          key={option}
          href={href(option)}
          aria-current={view === option ? "true" : undefined}
          className={cn(
            "rounded-md px-3 py-1.5 capitalize",
            view === option
              ? "bg-ink text-ink-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option === "grid" ? "Grid" : "Map"}
        </Link>
      ))}
    </div>
  );
}

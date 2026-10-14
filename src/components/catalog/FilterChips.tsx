import Link from "next/link";

import { cn } from "@/lib/utils";

export type Chip = { label: string; value?: string };

/** Link-based filter: each chip sets `param` in the URL, keeping the rest. */
export function FilterChips({
  basePath,
  param,
  chips,
  active,
  params = {},
}: {
  basePath: string;
  param: string;
  chips: Chip[];
  active?: string;
  params?: Record<string, string | undefined>;
}) {
  const href = (value?: string) => {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, [param]: value, page: undefined })) {
      if (v) search.set(k, v);
    }
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav aria-label="Filters" className="flex gap-2 overflow-x-auto pb-1">
      {chips.map((chip) => {
        const isActive = (chip.value ?? "") === (active ?? "");
        return (
          <Link
            key={chip.label}
            href={href(chip.value)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm whitespace-nowrap transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background hover:border-foreground/30",
            )}
          >
            {chip.label}
          </Link>
        );
      })}
    </nav>
  );
}

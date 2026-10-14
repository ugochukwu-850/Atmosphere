import Link from "next/link";

import { cn } from "@/lib/utils";

export function Pagination({
  basePath,
  page,
  pageSize,
  total,
  params = {},
}: {
  basePath: string;
  page: number;
  pageSize: number;
  total: number;
  params?: Record<string, string | undefined>;
}) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;

  const href = (p: number) => {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, page: p > 1 ? String(p) : undefined })) {
      if (v) search.set(k, v);
    }
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 pt-8">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "grid size-9 place-items-center rounded-md text-sm",
            p === page ? "bg-ink text-ink-foreground" : "hover:bg-muted",
          )}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}

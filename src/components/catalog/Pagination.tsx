import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/** Pages to show: first, last, current ±1, with ellipses (1 … 4 5 6 … 12). */
function pageList(page: number, pages: number): (number | "…")[] {
  const set = new Set(
    [1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages),
  );
  const sorted = [...set].sort((a, b) => a - b);
  return sorted.flatMap((p, i) =>
    i > 0 && p - sorted[i - 1] > 1 ? (["…", p] as const) : [p],
  );
}

const box = "grid size-9 place-items-center rounded-xs border text-xs";

/** Square pagination from the Location Search frame (active page in charcoal). */
export function Pagination({
  page,
  pages,
  href,
}: {
  page: number;
  pages: number;
  href: (p: number) => string;
}) {
  if (pages <= 1) return null;
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-end gap-1.5"
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          aria-label="Previous page"
          className={cn(box, "hover:bg-muted")}
        >
          <ChevronLeft className="size-3.5" />
        </Link>
      ) : (
        <span aria-hidden className={cn(box, "opacity-40")}>
          <ChevronLeft className="size-3.5" />
        </span>
      )}
      {pageList(page, pages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} aria-hidden className={box}>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              box,
              p === page
                ? "border-charcoal bg-charcoal text-white"
                : "hover:bg-muted",
            )}
          >
            {p}
          </Link>
        ),
      )}
      {page < pages ? (
        <Link
          href={href(page + 1)}
          aria-label="Next page"
          className={cn(box, "hover:bg-muted")}
        >
          <ChevronRight className="size-3.5" />
        </Link>
      ) : (
        <span aria-hidden className={cn(box, "opacity-40")}>
          <ChevronRight className="size-3.5" />
        </span>
      )}
    </nav>
  );
}

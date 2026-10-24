import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type Crumb = { href?: string; label: string };

/** "Home › Locations › Warehouse 17" (Figma: Location Detail). */
export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-3 text-[13px]">
        {crumbs.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-3">
            {c.href ? (
              <Link
                href={c.href}
                className={
                  i === 0
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-muted-foreground">
                {c.label}
              </span>
            )}
            {i < crumbs.length - 1 && (
              <ChevronRight aria-hidden className="size-3.5" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

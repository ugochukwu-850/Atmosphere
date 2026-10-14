import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { WIDE } from "@/components/catalog/SearchBand";
import { DotList } from "@/components/ui/typography";

/** Breadcrumb, big title and dot facts (Figma: Location Detail). */
export function DetailHeader({
  crumbs,
  title,
  facts,
}: {
  crumbs: { href?: string; label: string }[];
  title: string;
  facts: string[];
}) {
  return (
    <div className={`${WIDE} flex flex-col pt-10 md:pt-20`}>
      <div className="flex flex-col md:pl-[22px]">
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
        <h1 className="mt-8 max-w-[44rem] text-5xl leading-[0.95] font-bold tracking-tight md:text-[64px]">
          {title}
        </h1>
        <DotList items={facts} className="mt-10 md:pl-6" />
      </div>
    </div>
  );
}

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/** Wide content column of the Location Search frames (52px gutters at 1512). */
export const WIDE = "mx-auto w-full max-w-[1512px] px-5 md:px-10 xl:px-[52px]";

/**
 * Charcoal band under the dark header (Figma: Location Search): breadcrumb,
 * headline with a sand word, intro and a side note.
 */
export function SearchBand({
  crumbs,
  title,
  intro,
  note,
}: {
  crumbs: { href?: string; label: string }[];
  title: ReactNode;
  intro: string;
  note: { title: string; text: string };
}) {
  return (
    <section className="bg-charcoal text-white">
      <div
        className={`${WIDE} flex flex-col pt-10 pb-20 md:pt-[92px] md:pb-24`}
      >
        <nav aria-label="Breadcrumb" className="md:pl-6">
          <ol className="flex items-center gap-3 text-[13px]">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-3">
                {c.href ? (
                  <Link
                    href={c.href}
                    className={
                      i === 0 ? "text-white" : "text-white/45 hover:text-white"
                    }
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/45">
                    {c.label}
                  </span>
                )}
                <ChevronRight
                  aria-hidden
                  className={
                    i === 0 ? "size-3.5 text-white" : "size-3.5 text-white/45"
                  }
                />
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-16 flex flex-col gap-10 md:mt-24 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-[44rem] flex-col gap-8">
            <h1 className="text-5xl leading-[0.92] font-bold tracking-tight md:text-[64px]">
              {title}
            </h1>
            <p className="max-w-[43rem] text-base text-white/55">{intro}</p>
          </div>
          <div className="border-l border-white/35 py-1 pl-4 lg:w-[25rem]">
            <p className="text-lg font-semibold text-sand">{note.title}</p>
            <p className="mt-1 text-xs text-white/40">{note.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

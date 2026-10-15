import type { ReactNode } from "react";

import { WIDE } from "@/components/catalog/SearchBand";
import { Breadcrumb, type Crumb } from "@/components/detail/Breadcrumb";
import { Eyebrow } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/**
 * Shell for signed-in workspace pages (planner, bookings, account, listing
 * forms). No Figma frame exists for these, so it extends the Location Detail
 * template: breadcrumb, rust eyebrow, big Sora title, then a content column.
 */
export function WorkspacePage({
  crumbs,
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  description?: string;
  /** Buttons aligned with the title on the right (e.g. "Post a call"). */
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="pb-24">
      <header className={`${WIDE} pt-10 md:pt-20`}>
        <div className="flex flex-col gap-8 md:pl-[22px] lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-[48rem] flex-col">
            <Breadcrumb crumbs={crumbs} />
            {eyebrow && <Eyebrow className="mt-8">{eyebrow}</Eyebrow>}
            <h1
              className={cn(
                "text-5xl leading-[0.95] font-bold tracking-tight md:text-[64px]",
                eyebrow ? "mt-3" : "mt-8",
              )}
            >
              {title}
            </h1>
            {description && (
              <p className="mt-6 max-w-[40rem] text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
      </header>
      <div className={`${WIDE} mt-14`}>{children}</div>
    </article>
  );
}

/** Card section inside a workspace page (Cards + Panels fill, 16px radius). */
export function Panel({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-sand/40 bg-card p-6 md:p-8 dark:border-border",
        className,
      )}
    >
      {(title || description) && (
        <div className="flex flex-col gap-1.5">
          {title && (
            <h2 className="font-sans text-[22px] font-bold">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

/** Rust-bordered alert for action errors and confirmations. */
export function Notice({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "border-l-4 px-4 py-3 text-sm",
        tone === "error"
          ? "border-destructive bg-destructive/5 text-destructive"
          : "border-olive bg-olive/10 text-foreground",
      )}
    >
      {children}
    </p>
  );
}

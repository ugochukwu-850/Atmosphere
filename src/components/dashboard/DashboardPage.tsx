import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Content column inside the dashboard shell (1147px wide at 1512). */
export const DASHBOARD_PAGE =
  "mx-auto flex w-full max-w-[1209px] flex-col px-5 pt-8 pb-20 lg:px-[31px] lg:pt-[33px]";

/** "Welcome back to your creative space." style heading: Manrope 31 medium + 16 body. */
export function DashboardHeading({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="flex max-w-[790px] flex-col gap-2">
        <h1 className="font-sans text-[26px] leading-tight font-medium md:text-[31px]">
          {title}
        </h1>
        {description && <p className="text-base">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

/** Panel tile with a light caps label and a bold count (Figma: SAVED PLACES · 2). */
export function StatTile({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex min-h-[129px] flex-col gap-[23px] rounded-md border-[0.5px] border-sand bg-card p-2.5 dark:border-border">
      <p className="text-[13px] font-light uppercase">{label}</p>
      <p className="text-[25px] leading-none font-bold">{value}</p>
    </div>
  );
}

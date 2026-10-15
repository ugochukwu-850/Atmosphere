import type { ReactNode } from "react";

import { MapView } from "@/components/map/MapView";
import type { LatLng, MapMarker } from "@/types/map";

import { WIDE } from "./SearchBand";

/**
 * White results area of the Location Search frame: title + count on the left,
 * filters and the "Show Map" switch on the right, underline tabs, optional
 * full-width map, then the card grid and pagination.
 */
export function ResultsSection({
  title,
  summary,
  controls,
  tabs,
  children,
}: {
  title: string;
  summary: string;
  controls?: ReactNode;
  tabs?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`${WIDE} flex flex-col pt-16 pb-24`}>
      <h2 className="text-[28px] font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-[13px] text-muted-foreground">{summary}</p>
        {controls && (
          <div className="flex flex-wrap items-center gap-6">{controls}</div>
        )}
      </div>
      {tabs && <div className="mt-12">{tabs}</div>}
      <div className="mt-6 flex flex-col gap-10">{children}</div>
    </section>
  );
}

/** Full-width rounded map shown when "Show Map" is on. */
export function ResultsMap({
  center,
  markers,
}: {
  center: LatLng;
  markers: MapMarker[];
}) {
  return (
    <MapView
      center={center}
      markers={markers}
      className="h-[420px] rounded-xl border-0 md:h-[560px]"
    />
  );
}

export const PAGE_SIZE = 9;

export function paginate<T>(items: T[], page: number) {
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  return {
    pageItems: items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    page: current,
    pages,
  };
}

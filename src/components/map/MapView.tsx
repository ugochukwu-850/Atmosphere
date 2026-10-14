"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

import type { LeafletMapProps } from "./LeafletMap";

// Leaflet touches `window` on import, so it only loads in the browser.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="grid size-full place-items-center bg-muted text-sm text-muted-foreground">
      Preparing map…
    </div>
  ),
});

/**
 * Shared map: location/gear/cast search, listing detail pin, and pin-drop on the
 * listing form. Give it a height via className.
 */
export function MapView({
  className,
  ...props
}: LeafletMapProps & { className?: string }) {
  return (
    <div className={cn("isolate overflow-hidden rounded-xl border", className)}>
      <LeafletMap {...props} />
    </div>
  );
}

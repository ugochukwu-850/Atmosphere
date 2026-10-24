import { MapPin } from "lucide-react";

export function MapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <MapPin className="size-4 fill-rust text-rust" /> Bookable
      </span>
      <span className="flex items-center gap-1.5">
        <MapPin className="size-4 fill-olive text-olive" /> Scout-only
      </span>
    </div>
  );
}

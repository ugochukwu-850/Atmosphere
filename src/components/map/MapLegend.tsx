export function MapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-[2px] bg-rust" /> Bookable
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-gold" /> Scout only
      </span>
    </div>
  );
}

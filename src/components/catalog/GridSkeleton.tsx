export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border bg-card p-5"
        >
          <div className="aspect-[417/300] animate-pulse rounded-lg bg-muted" />
          <div className="h-3 w-1/3 animate-pulse rounded-xs bg-muted" />
          <div className="h-5 w-2/3 animate-pulse rounded-xs bg-muted" />
          <div className="h-3 w-full animate-pulse rounded-xs bg-muted" />
        </div>
      ))}
    </div>
  );
}

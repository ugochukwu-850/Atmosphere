/** Suspense fallback for the listing and casting forms (panel-shaped blocks). */
export function FormSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-hidden>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-5 rounded-xl border bg-card p-6 md:p-8"
        >
          <div className="h-5 w-1/4 animate-pulse rounded-xs bg-muted" />
          <div className="h-11 w-full animate-pulse rounded-sm bg-muted" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="h-11 animate-pulse rounded-sm bg-muted" />
            <div className="h-11 animate-pulse rounded-sm bg-muted" />
          </div>
          <div className="h-28 w-full animate-pulse rounded-sm bg-muted" />
        </div>
      ))}
    </div>
  );
}

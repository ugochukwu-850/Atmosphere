import { EmptyState } from "@/components/catalog/EmptyState";

/** No plan yet: what the planner will give back. */
export function PlanEmpty() {
  return (
    <EmptyState
      title="No plan yet"
      description="Write a brief above. The planner names the kit and shot types your shoot needs, then the places, gear and people you can book, with an indicative budget."
    />
  );
}

const bar = "animate-pulse rounded-xs bg-muted";

/** Plan card placeholder while a brief is being planned (or the page loads). */
export function PlanSkeleton({ label = "Planning…" }: { label?: string }) {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-sand/40 bg-card p-5 md:p-8 dark:border-border">
      <p role="status" className="text-sm font-medium text-primary">
        {label}
      </p>
      <div aria-hidden className="flex flex-col gap-5">
        <div className={`${bar} h-9 w-2/3 max-w-md`} />
        <div className={`${bar} h-4 w-full max-w-2xl`} />
        <div className="flex gap-10">
          <div className={`${bar} h-8 w-28`} />
          <div className={`${bar} h-8 w-28`} />
          <div className={`${bar} h-8 w-28`} />
        </div>
        <div className={`${bar} h-12 w-full rounded-md`} />
        <div className="grid gap-2.5 rounded-md bg-muted p-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-14 rounded-md bg-background" />
          ))}
        </div>
      </div>
    </div>
  );
}

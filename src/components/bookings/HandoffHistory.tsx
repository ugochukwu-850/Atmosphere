import { Check, Minus } from "lucide-react";

import { SafeImage } from "@/components/ui/safe-image";
import type { BookingHandoff } from "@/lib/data/bookings";
import { cn } from "@/lib/utils";

import { HANDOFF_CHECKS, phaseLabel } from "./handoff";
import { formatDateTime } from "./status";

/** Filed handoff reports, newest first, as ivory notes. */
export function HandoffHistory({
  handoffs,
  viewerId,
}: {
  handoffs: BookingHandoff[];
  viewerId: string;
}) {
  return (
    <section className="flex flex-col gap-4 border-t pt-6">
      <h3 className="font-sans text-lg font-bold">Handoff reports</h3>
      {handoffs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No reports yet. File one at pickup and another at return.
        </p>
      ) : (
        <ol className="flex flex-col gap-4">
          {[...handoffs].reverse().map((h) => (
            <li key={h.id}>
              <HandoffReport handoff={h} viewerId={viewerId} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function HandoffReport({
  handoff,
  viewerId,
}: {
  handoff: BookingHandoff;
  viewerId: string;
}) {
  const time = formatDateTime(handoff.createdAt);
  const by =
    handoff.authorId && handoff.authorId === viewerId
      ? "you"
      : handoff.authorName;
  const label = phaseLabel(handoff.phase);

  return (
    <article className="flex flex-col gap-4 rounded-lg bg-muted p-4 sm:flex-row md:p-5">
      {handoff.photoUrl && (
        <a
          href={handoff.photoUrl}
          target="_blank"
          rel="noreferrer"
          className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm bg-background sm:w-40"
        >
          {/* Uploads are served by the API host, which next/image isn't configured for. */}
          <SafeImage
            src={handoff.photoUrl}
            alt={`${label} photo`}
            fill
            unoptimized
            sizes="160px"
            className="object-cover"
          />
        </a>
      )}
      <div className="flex min-w-0 flex-col gap-3">
        <p className="text-sm">
          <span className="font-semibold">{label}</span>
          {time && (
            <span className="text-muted-foreground">
              {" · "}
              <time dateTime={handoff.createdAt}>{time}</time>
            </span>
          )}
          {by && <span className="text-muted-foreground"> · by {by}</span>}
        </p>
        <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {HANDOFF_CHECKS.map((check) => {
            const done = handoff[check.name];
            const Icon = done ? Check : Minus;
            return (
              <li
                key={check.name}
                className={cn(
                  "flex items-center gap-2 text-[13px]",
                  !done && "text-muted-foreground",
                )}
              >
                <Icon
                  aria-hidden
                  className={cn(
                    "size-4 shrink-0",
                    done ? "text-olive" : "text-subtle-foreground",
                  )}
                />
                <span>
                  {check.label}
                  <span className="sr-only">
                    {done ? " (yes)" : " (not checked)"}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        {handoff.notes && (
          <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap text-muted-foreground">
            {handoff.notes}
          </p>
        )}
      </div>
    </article>
  );
}

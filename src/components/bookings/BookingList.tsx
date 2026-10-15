import Link from "next/link";

import { SafeImage } from "@/components/ui/safe-image";
import { DotList } from "@/components/ui/typography";
import type { BookingSummary } from "@/lib/data/types";
import { formatNgn } from "@/lib/format";

import { formatDateRange, formatDays, kindNoun } from "./status";
import { StatusBadge } from "./StatusBadge";

/** Which side of the booking the viewer is on in this list. */
export type BookingSide = "sent" | "incoming";

export function BookingList({
  bookings,
  side,
}: {
  bookings: BookingSummary[];
  side: BookingSide;
}) {
  return (
    <ul className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <li key={booking.id}>
          <BookingRow booking={booking} side={side} />
        </li>
      ))}
    </ul>
  );
}

/**
 * One booking as a wide listing card (Cards + Panels fill, 16px radius):
 * photo, rust caps kicker, Sora title, dot facts, status badge and total.
 * The title link stretches over the whole card.
 */
function BookingRow({
  booking,
  side,
}: {
  booking: BookingSummary;
  side: BookingSide;
}) {
  const { item } = booking;
  const other = side === "sent" ? booking.owner : booking.renter;
  const facts = [
    formatDateRange(booking.startDate, booking.endDate),
    formatDays(booking.startDate, booking.endDate),
    other && `${side === "sent" ? "Listed by" : "Requested by"} ${other.name}`,
  ].filter((fact): fact is string => Boolean(fact));

  return (
    <article className="relative grid grid-cols-[88px_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-xl border border-sand/40 bg-card p-4 transition-colors hover:border-primary/50 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:gap-x-6 md:p-5 dark:border-border">
      <div className="relative row-span-2 aspect-square overflow-hidden rounded-lg bg-muted sm:row-span-1 sm:aspect-[417/300]">
        <SafeImage
          src={item?.photoUrl}
          alt=""
          fill
          sizes="160px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-2 self-center">
        <p className="text-[10px] leading-none font-extrabold tracking-[0.04em] text-primary uppercase">
          {[kindNoun(item?.kind), item?.neighborhood]
            .filter(Boolean)
            .join(" / ")}
        </p>
        <h3 className="truncate font-heading text-[22px] leading-tight">
          <Link
            href={`/bookings/${booking.id}`}
            className="after:absolute after:inset-0 after:rounded-xl hover:text-primary focus-visible:outline-none"
          >
            {item?.title ?? "Booking"}
          </Link>
        </h3>
        <DotList items={facts} />
      </div>

      <div className="col-start-2 flex items-center justify-between gap-3 sm:col-start-3 sm:flex-col sm:items-end sm:justify-center">
        <StatusBadge status={booking.status} />
        <p className="text-xl font-semibold">{formatNgn(booking.totalNgn)}</p>
      </div>
    </article>
  );
}

/** Placeholder rows while bookings load. */
export function BookingListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-xl border bg-card p-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6 md:p-5"
        >
          <div className="aspect-square animate-pulse rounded-lg bg-muted sm:aspect-[417/300]" />
          <div className="flex flex-col justify-center gap-3">
            <div className="h-3 w-1/4 animate-pulse rounded-xs bg-muted" />
            <div className="h-5 w-1/2 animate-pulse rounded-xs bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded-xs bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

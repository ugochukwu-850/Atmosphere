import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { Suspense } from "react";

import {
  BookingThreadSkeleton,
  BookingUnavailable,
} from "@/components/bookings/BookingUnavailable";
import { BookingSummaryPanel } from "@/components/bookings/BookingSummaryPanel";
import { HandoffForm } from "@/components/bookings/HandoffForm";
import { HandoffHistory } from "@/components/bookings/HandoffHistory";
import { MessageComposer } from "@/components/bookings/MessageComposer";
import { MessageThread } from "@/components/bookings/MessageThread";
import {
  bookingRole,
  formatDateRange,
  formatDays,
  kindNoun,
  statusMeta,
  type BookingRole,
} from "@/components/bookings/status";
import { Callout, FactsRow, ListedBy } from "@/components/detail/Sections";
import { ButtonLink } from "@/components/ui/button";
import { Panel, WorkspacePage } from "@/components/workspace/WorkspacePage";
import { ApiError } from "@/lib/api/client";
import { requireUser } from "@/lib/auth/require";
import {
  getBookingThread,
  type BookingThread,
  type BookingThreadResult,
  type HandoffPhase,
} from "@/lib/data/bookings";
import { formatNgn } from "@/lib/format";
import { bookingIdSchema } from "@/lib/validators/booking";

export const metadata: Metadata = { title: "Booking" };

// `params` and the session cookie are request-time data, read inside Suspense.
export default function BookingPage({ params }: PageProps<"/bookings/[id]">) {
  return (
    <Suspense fallback={<BookingThreadSkeleton />}>
      <BookingContent params={params} />
    </Suspense>
  );
}

async function BookingContent({
  params,
}: Pick<PageProps<"/bookings/[id]">, "params">) {
  const { id } = await params;
  if (!bookingIdSchema.safeParse(id).success) notFound();
  const path = `/bookings/${id}`;
  const { user, token } = await requireUser(path);

  let result: BookingThreadResult;
  try {
    result = await getBookingThread(token, id);
  } catch (err) {
    unstable_rethrow(err);
    if (err instanceof ApiError && err.status === 401)
      redirect(`/login?next=${encodeURIComponent(path)}`);
    return <BookingUnavailable reason="error" />;
  }
  if (result.status === "not_found") notFound();
  if (result.status === "forbidden")
    return <BookingUnavailable reason="forbidden" />;

  const { booking } = result;
  const role = bookingRole(booking, user);
  const title = booking.item?.title ?? "Booking";
  // The owner sees who asked; everyone else sees who listed it.
  const other = role === "owner" ? booking.renter : booking.owner;
  const party = role === "owner" || role === "renter";
  const days = formatDays(booking.startDate, booking.endDate);

  return (
    <WorkspacePage
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/bookings", label: "Bookings" },
        { label: title },
      ]}
      eyebrow={kindNoun(booking.item?.kind)}
      title={title}
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,876fr)_minmax(0,475fr)] lg:gap-[55px]">
        <div className="flex flex-col gap-10">
          <section className="flex flex-col gap-5">
            {other && (
              <ListedBy
                label={role === "owner" ? "Requested by" : "Listed by"}
                name={other.name}
                href={other.id ? `/people/${other.id}` : undefined}
              />
            )}
            <FactsRow
              items={[
                statusMeta(booking.status).label,
                formatDateRange(booking.startDate, booking.endDate),
                ...(days ? [days] : []),
                `Total ${formatNgn(booking.totalNgn)}`,
              ]}
            />
            {booking.note && (
              <Callout
                title={
                  role === "renter"
                    ? "Your note with the request"
                    : `Note from ${booking.renter?.name ?? "the renter"}`
                }
              >
                {booking.note}
              </Callout>
            )}
          </section>

          <Panel
            title="Messages"
            description={`Everything here is shared between you and ${other?.name ?? "the other party"}: dates, call times, payment and pickup.`}
          >
            <MessageThread messages={booking.messages} viewerId={user.id} />
            {party && (
              <MessageComposer bookingId={booking.id} recipient={other?.name} />
            )}
          </Panel>

          {booking.item?.kind === "gear" && (
            <Panel
              title="Gear handoff"
              description="Check the kit together at pickup and again at return. Each report is kept on this booking."
            >
              <HandoffSection booking={booking} role={role} />
              <HandoffHistory handoffs={booking.handoffs} viewerId={user.id} />
            </Panel>
          )}

          <ButtonLink
            href="/bookings"
            variant="outline"
            className="h-12 self-start px-5 text-sm font-normal"
          >
            <ChevronLeft className="size-4" />
            Back to bookings
          </ButtonLink>
        </div>

        {/* Status and the owner's next step come first on small screens. */}
        <aside className="order-first lg:order-none">
          <BookingSummaryPanel booking={booking} role={role} />
        </aside>
      </div>
    </WorkspacePage>
  );
}

/** Handoffs start once the rental is paid and stop once it's closed or off. */
const HANDOFF_NOT_YET = new Set(["requested", "awaiting_funds"]);
const HANDOFF_OVER = new Set(["closed", "declined", "cancelled"]);

function HandoffSection({
  booking,
  role,
}: {
  booking: BookingThread;
  role: BookingRole;
}) {
  if (HANDOFF_NOT_YET.has(booking.status))
    return (
      <Callout title="Not yet">
        The pickup checklist opens once the rental is accepted and marked paid.
      </Callout>
    );
  if (HANDOFF_OVER.has(booking.status))
    return (
      <Callout title="No handoff to record">
        {booking.status === "closed"
          ? "The kit is back and this rental is closed."
          : "This rental didn't go ahead."}
      </Callout>
    );
  // Only the two parties file reports.
  if (role !== "owner" && role !== "renter") return null;

  // Default to the return once the kit has gone out.
  const out = booking.handoffs.some((h) => h.phase === "out");
  const back = booking.handoffs.some((h) => h.phase === "in");
  const phase: HandoffPhase =
    booking.status === "handoff_out" || (out && !back) ? "in" : "out";
  return <HandoffForm bookingId={booking.id} defaultPhase={phase} />;
}

import Link from "next/link";
import type { ReactNode } from "react";

import { PricePanel } from "@/components/detail/PriceCard";
import { ButtonLink } from "@/components/ui/button";
import type { BookingThread } from "@/lib/data/bookings";

import { MarkPaidAction, RespondActions } from "./OwnerActions";
import {
  formatDateRange,
  formatDays,
  listingHref,
  statusGuidance,
  statusMeta,
  type BookingRole,
} from "./status";

/**
 * Right column of the thread, on the listing page's price panel: total,
 * status dot with what happens next, booking facts, then the owner's
 * action for the current status, or a jump to the messages.
 */
export function BookingSummaryPanel({
  booking,
  role,
}: {
  booking: BookingThread;
  role: BookingRole;
}) {
  const { label, tone } = statusMeta(booking.status);
  const counterparty = role === "owner" ? booking.renter : booking.owner;
  const renterName = booking.renter?.name ?? "The renter";

  let action: ReactNode = null;
  if (booking.status === "requested" && role === "owner") {
    action = <RespondActions bookingId={booking.id} renterName={renterName} />;
  } else if (
    booking.status === "awaiting_funds" &&
    (role === "owner" || role === "admin")
  ) {
    action = <MarkPaidAction bookingId={booking.id} renterName={renterName} />;
  } else if (role === "owner" || role === "renter") {
    action = (
      <ButtonLink
        href="#message-body"
        variant="secondary"
        size="lg"
        className="h-[66px] w-full rounded-sm text-[15px] font-normal"
      >
        {counterparty ? `Message ${counterparty.name}` : "Send a message"}
      </ButtonLink>
    );
  }

  return (
    <PricePanel
      amountNgn={booking.totalNgn}
      unit=" total"
      status={{ label, tone: tone === "olive" ? "olive" : "sand" }}
      note={statusGuidance(booking, role)}
    >
      <dl className="flex flex-col divide-y border-y text-sm">
        <Fact term="Dates">
          {formatDateRange(booking.startDate, booking.endDate)}
        </Fact>
        {formatDays(booking.startDate, booking.endDate) && (
          <Fact term="Duration">
            {formatDays(booking.startDate, booking.endDate)}
          </Fact>
        )}
        {booking.renter && role !== "renter" && (
          <Fact term="Renter">
            <PersonLink id={booking.renter.id} name={booking.renter.name} />
          </Fact>
        )}
        {booking.owner && role !== "owner" && (
          <Fact term="Owner">
            <PersonLink id={booking.owner.id} name={booking.owner.name} />
          </Fact>
        )}
        {booking.item && (
          <Fact term="Listing">
            <Link
              href={listingHref(booking.item)}
              className="text-primary hover:underline"
            >
              View listing
            </Link>
          </Fact>
        )}
      </dl>
      {action}
    </PricePanel>
  );
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

function PersonLink({ id, name }: { id: string; name: string }) {
  return id ? (
    <Link href={`/people/${id}`} className="hover:text-primary">
      {name}
    </Link>
  ) : (
    name
  );
}

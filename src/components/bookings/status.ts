/**
 * Presentation helpers shared by the bookings list and thread: status labels
 * and tones, who the viewer is on a booking, and date formatting.
 */
import type { SessionUser } from "@/lib/auth/types";
import type { BookingThread } from "@/lib/data/bookings";
import type { BookingSummary, CatalogItem, ItemKind } from "@/lib/data/types";
import { formatDate, titleCase } from "@/lib/format";
import { bookingDays } from "@/lib/validators/booking";

/** olive = going ahead, sand = waiting on someone, neutral = finished or off. */
export type StatusTone = "olive" | "sand" | "neutral";

const STATUS: Record<string, { label: string; tone: StatusTone }> = {
  requested: { label: "Requested", tone: "sand" },
  awaiting_funds: { label: "Awaiting payment", tone: "sand" },
  confirmed: { label: "Confirmed", tone: "olive" },
  handoff_out: { label: "Picked up", tone: "olive" },
  closed: { label: "Closed", tone: "neutral" },
  declined: { label: "Declined", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export function statusMeta(status: string): {
  label: string;
  tone: StatusTone;
} {
  return STATUS[status] ?? { label: titleCase(status), tone: "neutral" };
}

const KIND_NOUN: Record<ItemKind, string> = {
  location: "Location booking",
  gear: "Gear rental",
  talent: "Talent hire",
  gear_sale: "Gear purchase",
};

export const kindNoun = (kind?: ItemKind) =>
  kind ? KIND_NOUN[kind] : "Booking";

/** Detail page for the booked listing (talent has its own route). */
export const listingHref = (item: CatalogItem) =>
  item.kind === "talent" ? `/cast/talent/${item.id}` : `/listings/${item.id}`;

/**
 * The viewer's side of a booking. Admins who are neither party can still
 * mark a booking paid; anyone else only reads.
 */
export type BookingRole = "owner" | "renter" | "admin" | "viewer";

export function bookingRole(
  booking: BookingSummary & { renterId?: string; ownerId?: string },
  user: SessionUser,
): BookingRole {
  const ownerId = booking.ownerId ?? booking.owner?.id;
  const renterId = booking.renterId ?? booking.renter?.id;
  if (user.id && user.id === ownerId) return "owner";
  if (user.id && user.id === renterId) return "renter";
  return user.roles.includes("admin") ? "admin" : "viewer";
}

/** One line telling the viewer where the booking stands and what's next. */
export function statusGuidance(
  booking: BookingThread,
  role: BookingRole,
): string {
  const owner = booking.owner?.name ?? "the owner";
  const renter = booking.renter?.name ?? "the renter";
  const managing = role === "owner" || role === "admin";
  const gear = booking.item?.kind === "gear";

  switch (booking.status) {
    case "requested":
      return managing
        ? `${renter} wants these dates. Accept to hold them, or decline. Ask anything first in the messages.`
        : `Sent to ${owner}. They accept or decline; message them here in the meantime.`;
    case "awaiting_funds":
      return managing
        ? `Accepted. Mark it paid once ${renter}'s payment reaches you; that confirms the booking.`
        : `${owner} accepted. Pay them as agreed in the messages; they mark it paid when the money arrives.`;
    case "confirmed":
      return gear
        ? "Paid and confirmed. Check the kit together at pickup and log it under Gear handoff."
        : "Paid and confirmed. Use the messages for call times, access and anything else.";
    case "handoff_out":
      return "The kit is out. Log the return checklist when it comes back.";
    case "closed":
      return gear
        ? "The kit is back and this rental is closed."
        : "This booking is closed.";
    case "declined":
      return role === "owner"
        ? "You declined this request."
        : `${owner} declined this request. Try other dates or another listing.`;
    case "cancelled":
      return "This booking was cancelled.";
    default:
      return `Status: ${statusMeta(booking.status).label}.`;
  }
}

const validDate = (iso: string) =>
  Boolean(iso) && !Number.isNaN(Date.parse(iso));

/** "12 Nov 2026 – 14 Nov 2026", one date when they match. */
export function formatDateRange(start: string, end: string): string {
  const from = validDate(start) ? formatDate(start) : undefined;
  const to = validDate(end) ? formatDate(end) : undefined;
  if (!from || !to) return from ?? to ?? "Dates to confirm";
  return from === to ? from : `${from} – ${to}`;
}

/** "3 days", or undefined when the dates are missing. */
export function formatDays(start: string, end: string): string | undefined {
  const days = bookingDays(start, end);
  return days > 0 ? `${days} day${days === 1 ? "" : "s"}` : undefined;
}

/** "12 Nov, 14:05" (Lagos time) for message and handoff timestamps. */
export function formatDateTime(iso?: string): string | undefined {
  if (!iso || !validDate(iso)) return undefined;
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  });
}

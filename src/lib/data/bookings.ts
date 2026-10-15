/** Bookings data for the signed-in user (renter and owner side). */
import { ApiError, orNull, unwrap } from "@/lib/api/client";
import {
  getV1Bookings,
  getV1BookingsById,
  type ListingCard,
  type PublicUser,
} from "@/lib/api/generated";
import { env } from "@/lib/env";

import { getItem } from "./catalog";
import { toBooking, toItem, toPerson } from "./normalize";
import type { BookingSummary, Person } from "./types";

export async function listBookings(token: string): Promise<BookingSummary[]> {
  const data = await unwrap(getV1Bookings({ auth: token }));
  return (data.bookings ?? []).map(toBooking);
}

/**
 * Booking lifecycle. The spec types `status` as a plain string; these values
 * come from the endpoint docs: accept moves `requested` to `awaiting_funds`,
 * mark-paid to `confirmed`, decline to `declined`, and a gear handoff to
 * `handoff_out` (pickup) then `closed` (return). Unknown values pass through.
 */
export const BOOKING_STATUSES = [
  "requested",
  "awaiting_funds",
  "confirmed",
  "handoff_out",
  "closed",
  "declined",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type BookingMessage = {
  id: string;
  body: string;
  createdAt?: string;
  authorId?: string;
  /** Sent with the message, else the renter's or owner's name. */
  authorName?: string;
};

/** "out" = pickup, "in" = return. */
export type HandoffPhase = "out" | "in";

export type BookingHandoff = {
  id: string;
  phase: HandoffPhase;
  serialChecked: boolean;
  accessoriesComplete: boolean;
  existingDamageNoted: boolean;
  functionTest: boolean;
  notes?: string;
  photoUrl?: string;
  createdAt?: string;
  authorId?: string;
  authorName?: string;
};

/** The booking thread view model: summary fields plus messages and handoffs. */
export type BookingThread = BookingSummary & {
  renterId?: string;
  ownerId?: string;
  listingId?: string;
  /** The renter's note from the original request. */
  note?: string;
  createdAt?: string;
  /** Oldest first. */
  messages: BookingMessage[];
  /** Oldest first. */
  handoffs: BookingHandoff[];
};

export type BookingThreadResult =
  | { status: "ok"; booking: BookingThread }
  | { status: "not_found" }
  | { status: "forbidden" };

/**
 * One booking thread, or why it can't be shown. The thread endpoint is loosely
 * typed, so the summary from GET /v1/bookings fills in listing, renter, owner,
 * dates and total when the thread leaves them out. 401s and other failures throw.
 */
export async function getBookingThread(
  token: string,
  id: string,
): Promise<BookingThreadResult> {
  const summaries = listBookings(token).catch((): BookingSummary[] => []);

  let raw: Raw | null;
  try {
    const data = await orNull(
      unwrap(getV1BookingsById({ auth: token, path: { id } })),
    );
    raw = isRecord(data?.booking) ? data.booking : null;
  } catch (err) {
    if (err instanceof ApiError && err.status === 403)
      return { status: "forbidden" };
    throw err;
  }
  if (!raw) return { status: "not_found" };

  const summary = (await summaries).find((b) => b.id === id);
  const booking = toThread(raw, summary);

  // Last resort for the listing card: look the listing up directly.
  if (!booking.item && booking.listingId) {
    const detail = await getItem(booking.listingId).catch(() => null);
    if (detail) {
      const { owner, ...item } = detail;
      booking.item = item;
      booking.owner ??= owner;
      booking.ownerId ??= owner?.id;
    }
  }
  return { status: "ok", booking };
}

// ---------------------------------------------------------------------------
// Normalizers. The message and handoff shapes are not in the OpenAPI spec, so
// every field is optional and a few likely spellings are accepted.

type Raw = Record<string, unknown>;

const isRecord = (value: unknown): value is Raw =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

/** First non-empty string (or number, as a string) among `keys`. */
function pickString(raw: Raw | undefined, ...keys: string[]) {
  for (const key of keys) {
    const value = raw?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value))
      return String(value);
  }
  return undefined;
}

function pickNumber(raw: Raw, ...keys: string[]) {
  for (const key of keys) {
    const value = raw[key];
    const n = typeof value === "string" ? Number(value) : value;
    if (typeof n === "number" && Number.isFinite(n) && value !== "") return n;
  }
  return undefined;
}

function pickRecord(raw: Raw | undefined, ...keys: string[]) {
  for (const key of keys) {
    const value = raw?.[key];
    if (isRecord(value)) return value;
  }
  return undefined;
}

/** Checklist values arrive as booleans or as the "true" strings the form sent. */
function flag(value: unknown): boolean {
  if (typeof value === "string")
    return ["true", "1", "on", "yes"].includes(value.toLowerCase());
  return value === true || value === 1;
}

function toParty(value: unknown): Person | undefined {
  return isRecord(value) && (value.id || value.name)
    ? toPerson(value as PublicUser)
    : undefined;
}

/** Uploads may come back as API-relative paths ("/uploads/…"). http(s) only. */
function absoluteUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  try {
    const url = new URL(path, env.NEXT_PUBLIC_API_URL);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

const time = (iso?: string) => (iso ? Date.parse(iso) || 0 : 0);
const oldestFirst = <T extends { createdAt?: string }>(a: T, b: T) =>
  time(a.createdAt) - time(b.createdAt);

function toMessage(raw: unknown, index: number): BookingMessage | null {
  if (!isRecord(raw)) return null;
  const body = pickString(raw, "body", "text", "message", "content");
  if (!body) return null;
  const author = pickRecord(raw, "author", "sender", "user", "from");
  return {
    id: pickString(raw, "id") ?? `message-${index}`,
    body,
    createdAt: pickString(raw, "createdAt", "created_at", "sentAt"),
    authorId:
      pickString(raw, "authorId", "senderId", "userId", "fromId") ??
      pickString(author, "id"),
    authorName:
      pickString(raw, "authorName", "senderName") ?? pickString(author, "name"),
  };
}

function toHandoff(raw: unknown, index: number): BookingHandoff | null {
  if (!isRecord(raw)) return null;
  // The checklist may be flat or nested under `checklist`.
  const checks = { ...raw, ...pickRecord(raw, "checklist", "checks") };
  const phase = pickString(raw, "phase", "direction")?.toLowerCase();
  const author = pickRecord(
    raw,
    "author",
    "reporter",
    "filedBy",
    "createdBy",
    "user",
  );
  return {
    id: pickString(raw, "id") ?? `handoff-${index}`,
    phase: phase === "in" || phase === "return" ? "in" : "out",
    serialChecked: flag(checks.serialChecked),
    accessoriesComplete: flag(checks.accessoriesComplete),
    existingDamageNoted: flag(checks.existingDamageNoted),
    functionTest: flag(checks.functionTest),
    notes: pickString(raw, "notes", "note"),
    photoUrl: absoluteUrl(
      pickString(raw, "photoUrl", "photo", "photoPath", "imageUrl", "image"),
    ),
    createdAt: pickString(raw, "createdAt", "created_at", "recordedAt"),
    authorId:
      pickString(
        raw,
        "authorId",
        "reporterId",
        "filedById",
        "createdById",
        "userId",
      ) ?? pickString(author, "id"),
    authorName: pickString(author, "name"),
  };
}

const present = <T>(value: T | null): value is T => value !== null;

function toThread(raw: Raw, summary?: BookingSummary): BookingThread {
  const listing = pickRecord(raw, "listing");
  const card = listing ? toItem(listing as ListingCard) : undefined;
  const item = card?.id ? card : summary?.item;
  const renter = toParty(raw.renter) ?? summary?.renter;
  const owner = toParty(raw.owner) ?? toParty(listing?.owner) ?? summary?.owner;
  const renterId = pickString(raw, "renterId") ?? renter?.id;
  const ownerId =
    pickString(raw, "ownerId") ?? pickString(listing, "ownerId") ?? owner?.id;

  // Name messages and handoffs that only carry an author id.
  const names = new Map<string, string>();
  if (renterId && renter) names.set(renterId, renter.name);
  if (ownerId && owner) names.set(ownerId, owner.name);
  const named = <T extends { authorId?: string; authorName?: string }>(
    entry: T,
  ): T => ({
    ...entry,
    authorName:
      entry.authorName ??
      (entry.authorId ? names.get(entry.authorId) : undefined),
  });

  return {
    id: pickString(raw, "id") ?? summary?.id ?? "",
    status: pickString(raw, "status") ?? summary?.status ?? "requested",
    totalNgn: pickNumber(raw, "totalNgn", "total") ?? summary?.totalNgn ?? 0,
    startDate: pickString(raw, "startDate") ?? summary?.startDate ?? "",
    endDate: pickString(raw, "endDate") ?? summary?.endDate ?? "",
    item,
    renter,
    owner,
    renterId,
    ownerId,
    listingId: pickString(raw, "listingId") ?? (item?.id || undefined),
    note: pickString(raw, "note"),
    createdAt: pickString(raw, "createdAt"),
    messages: asArray(raw.messages)
      .map(toMessage)
      .filter(present)
      .map(named)
      .sort(oldestFirst),
    handoffs: asArray(raw.handoffs)
      .map(toHandoff)
      .filter(present)
      .map(named)
      .sort(oldestFirst),
  };
}

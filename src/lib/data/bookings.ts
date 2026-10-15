/** Bookings data for the signed-in user (renter and owner side). */
import { orNull, unwrap } from "@/lib/api/client";
import { getV1Bookings, getV1BookingsById } from "@/lib/api/generated";

import { toBooking } from "./normalize";
import type { BookingSummary } from "./types";

export async function listBookings(token: string): Promise<BookingSummary[]> {
  const data = await unwrap(getV1Bookings({ auth: token }));
  return (data.bookings ?? []).map(toBooking);
}

export async function getBookingThread(token: string, id: string) {
  const data = await orNull(
    unwrap(getV1BookingsById({ auth: token, path: { id } })),
  );
  return data?.booking ?? null;
}

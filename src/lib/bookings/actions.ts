"use server";

import { z } from "zod";

import { ApiError, unwrap } from "@/lib/api/client";
import { postV1Bookings } from "@/lib/api/generated";
import { getSessionToken } from "@/lib/auth/session";
import { bookingRequestSchema } from "@/lib/validators/booking";

export type BookingFormState = {
  ok?: boolean;
  bookingId?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

/** Book a location, rent gear or hire talent: all are listings to the API. */
export async function requestBookingAction(
  listingId: string,
  _prev: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const token = await getSessionToken();
  if (!token) return { error: "Sign in to send a request." };

  const parsed = bookingRequestSchema.safeParse({
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  try {
    const data = await unwrap(postV1Bookings({ auth: token, body: { listingId, ...parsed.data } }));
    return { ok: true, bookingId: data.booking?.id };
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return { fieldErrors: { startDate: ["Those dates are already booked."] } };
    }
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Your session expired. Sign in again." };
    }
    return { error: err instanceof ApiError ? err.message : "Could not send the request." };
  }
}

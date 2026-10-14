"use server";

import { z } from "zod";

import { ApiError, unwrap } from "@/lib/api/client";
import { createBooking } from "@/lib/api/generated";
import { getSessionToken } from "@/lib/auth/session";
import { bookingRequestSchema } from "@/lib/validators/booking";

export type BookingFormState = {
  ok?: boolean;
  bookingId?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const targetSchema = z.union([
  z.object({ listingId: z.string().min(1), talentId: z.undefined() }),
  z.object({ talentId: z.string().min(1), listingId: z.undefined() }),
]);

export async function requestBookingAction(
  target: { listingId?: string; talentId?: string },
  _prev: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const token = await getSessionToken();
  if (!token) return { error: "Sign in to send a request." };

  const parsedTarget = targetSchema.safeParse(target);
  if (!parsedTarget.success) return { error: "Nothing selected to book." };

  const parsed = bookingRequestSchema.safeParse({
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  if (process.env.API_MOCK !== "0") {
    return { ok: true, bookingId: "bk-mock" };
  }

  try {
    const booking = await unwrap(
      createBooking({ auth: token, body: { ...parsedTarget.data, ...parsed.data } }),
    );
    return { ok: true, bookingId: booking.id };
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return { fieldErrors: { startDate: ["Those dates are already booked."] } };
    }
    return { error: err instanceof ApiError ? err.message : "Could not send the request." };
  }
}

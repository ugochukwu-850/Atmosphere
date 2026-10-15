"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ApiError, unwrap } from "@/lib/api/client";
import {
  postV1Bookings,
  postV1BookingsByIdAccept,
  postV1BookingsByIdDecline,
  postV1BookingsByIdHandoff,
  postV1BookingsByIdMarkPaid,
  postV1BookingsByIdMessages,
} from "@/lib/api/generated";
import { getSessionToken } from "@/lib/auth/session";
import {
  apiErrorMessage,
  fieldErrors,
  str,
  type ActionState,
} from "@/lib/forms";
import {
  bookingIdSchema,
  bookingRequestSchema,
  handoffSchema,
  messageSchema,
} from "@/lib/validators/booking";

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
  if (!parsed.success)
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  try {
    const data = await unwrap(
      postV1Bookings({ auth: token, body: { listingId, ...parsed.data } }),
    );
    return { ok: true, bookingId: data.booking?.id };
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return {
        fieldErrors: { startDate: ["Those dates are already booked."] },
      };
    }
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Your session expired. Sign in again." };
    }
    return {
      error:
        err instanceof ApiError ? err.message : "Could not send the request.",
    };
  }
}

// ---------------------------------------------------------------------------
// Booking thread actions. Each one re-renders the thread (and the list, whose
// status badges change) so the page shows the new state in the same response.

function refreshBooking(id: string) {
  revalidatePath(`/bookings/${id}`);
  revalidatePath("/bookings");
}

/** Session token + validated booking id, or the error to show instead. */
async function bookingContext(
  bookingId: string,
): Promise<{ token: string; id: string } | { error: string }> {
  const id = bookingIdSchema.safeParse(bookingId);
  if (!id.success) return { error: "That booking link isn't valid." };
  const token = await getSessionToken();
  if (!token) return { error: "Your session expired. Sign in again." };
  return { token, id: id.data };
}

const STALE = "This booking has already moved on. Refresh to see where it is.";

/**
 * Accept, decline and mark-paid take no body: call, then refresh. They are used
 * with useActionState bound to the booking id; the state and form are unused.
 */
async function statusAction(
  bookingId: string,
  send: (auth: string, id: string) => Promise<unknown>,
  forbidden: string,
): Promise<ActionState> {
  const ctx = await bookingContext(bookingId);
  if ("error" in ctx) return { error: ctx.error };
  try {
    await send(ctx.token, ctx.id);
  } catch (err) {
    return {
      error: apiErrorMessage(err, {
        403: forbidden,
        404: "This booking no longer exists.",
        409: STALE,
      }),
    };
  }
  refreshBooking(ctx.id);
  return { ok: true };
}

/** Owner accepts a `requested` booking; it moves to `awaiting_funds`. */
export async function acceptBookingAction(
  bookingId: string,
): Promise<ActionState> {
  return statusAction(
    bookingId,
    (auth, id) => unwrap(postV1BookingsByIdAccept({ auth, path: { id } })),
    "Only the listing owner can accept this request.",
  );
}

/** Owner declines a `requested` booking. */
export async function declineBookingAction(
  bookingId: string,
): Promise<ActionState> {
  return statusAction(
    bookingId,
    (auth, id) => unwrap(postV1BookingsByIdDecline({ auth, path: { id } })),
    "Only the listing owner can decline this request.",
  );
}

/** Owner (or admin) confirms payment on an `awaiting_funds` booking. */
export async function markPaidAction(bookingId: string): Promise<ActionState> {
  return statusAction(
    bookingId,
    (auth, id) => unwrap(postV1BookingsByIdMarkPaid({ auth, path: { id } })),
    "Only the listing owner can mark this booking paid.",
  );
}

export type MessageValues = { body: string };

/** Add a message to the booking thread. */
export async function sendMessageAction(
  bookingId: string,
  _prev: ActionState<MessageValues>,
  formData: FormData,
): Promise<ActionState<MessageValues>> {
  const values = { body: str(formData, "body") };
  const parsed = messageSchema.safeParse(values);
  if (!parsed.success)
    return { fieldErrors: fieldErrors(parsed.error), values };

  const ctx = await bookingContext(bookingId);
  if ("error" in ctx) return { error: ctx.error, values };
  try {
    await unwrap(
      postV1BookingsByIdMessages({
        auth: ctx.token,
        path: { id: ctx.id },
        body: parsed.data,
      }),
    );
  } catch (err) {
    return {
      error: apiErrorMessage(err, {
        403: "Only the renter and the owner can message on this booking.",
      }),
      values,
    };
  }
  refreshBooking(ctx.id);
  return { ok: true };
}

export type HandoffValues = {
  phase: string;
  notes: string;
  serialChecked: boolean;
  accessoriesComplete: boolean;
  existingDamageNoted: boolean;
  functionTest: boolean;
};

/** File a gear pickup ("out") or return ("in") report, with an optional photo. */
export async function recordHandoffAction(
  bookingId: string,
  _prev: ActionState<HandoffValues>,
  formData: FormData,
): Promise<ActionState<HandoffValues>> {
  const values: HandoffValues = {
    phase: str(formData, "phase"),
    notes: str(formData, "notes"),
    // Unchecked boxes are left out of the form data.
    serialChecked: formData.has("serialChecked"),
    accessoriesComplete: formData.has("accessoriesComplete"),
    existingDamageNoted: formData.has("existingDamageNoted"),
    functionTest: formData.has("functionTest"),
  };
  const photo = formData.get("photo");
  const parsed = handoffSchema.safeParse({
    ...values,
    notes: values.notes || undefined,
    // An empty file input still submits a nameless, zero-byte File.
    photo: photo instanceof File && photo.size > 0 ? photo : undefined,
  });
  if (!parsed.success)
    return { fieldErrors: fieldErrors(parsed.error), values };

  const ctx = await bookingContext(bookingId);
  if ("error" in ctx) return { error: ctx.error, values };

  const { phase, notes, photo: file, ...checks } = parsed.data;
  // The API reads checked boxes as the string "true"; unchecked ones are omitted.
  const ticked = (on: boolean) => (on ? "true" : undefined);
  try {
    await unwrap(
      postV1BookingsByIdHandoff({
        auth: ctx.token,
        path: { id: ctx.id },
        body: {
          phase,
          notes,
          serialChecked: ticked(checks.serialChecked),
          accessoriesComplete: ticked(checks.accessoriesComplete),
          existingDamageNoted: ticked(checks.existingDamageNoted),
          functionTest: ticked(checks.functionTest),
          photo: file,
        },
        // The generated validator types `photo` as a string (OpenAPI
        // `format: binary`) and would reject the File; handoffSchema above
        // has already validated every field.
        requestValidator: async () => undefined,
      }),
    );
  } catch (err) {
    return {
      error: apiErrorMessage(err, {
        403: "Only the renter and the owner can file a handoff report.",
        409: STALE,
      }),
      values,
    };
  }
  refreshBooking(ctx.id);
  return { ok: true };
}

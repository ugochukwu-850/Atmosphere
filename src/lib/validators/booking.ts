import { z } from "zod";

/** Booking (location), rental (gear) or hire (talent) request. Dates are YYYY-MM-DD. */
export const bookingRequestSchema = z
  .object({
    startDate: z.iso.date({ error: "Pick a start date" }),
    endDate: z.iso.date({ error: "Pick an end date" }),
    note: z
      .string()
      .trim()
      .max(1000, "Note must be 1000 characters or fewer")
      .optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

/** Booking ids from the API are cuids; anything else never reaches the API. */
export const bookingIdSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9_-]{1,64}$/, "That booking link isn't valid");

/** POST /v1/bookings/{id}/messages body (1–2000 characters). */
export const messageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Write a message first")
    .max(2000, "Messages must be 2000 characters or fewer"),
});

/** Photo types and size the handoff endpoint accepts (API limit: 8MB). */
export const HANDOFF_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
export const HANDOFF_PHOTO_MAX_BYTES = 8_000_000;

/** Gear handoff report: pickup ("out") or return ("in") checklist. */
export const handoffSchema = z.object({
  phase: z.enum(["out", "in"], { error: "Choose pickup or return" }),
  serialChecked: z.boolean(),
  accessoriesComplete: z.boolean(),
  existingDamageNoted: z.boolean(),
  functionTest: z.boolean(),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2000 characters or fewer")
    .optional(),
  photo: z
    .file()
    .mime([...HANDOFF_PHOTO_TYPES], {
      error: "Use a JPEG, PNG, WebP or GIF photo",
    })
    .max(HANDOFF_PHOTO_MAX_BYTES, { error: "Photo must be 8MB or smaller" })
    .optional(),
});

/** Inclusive day count between two YYYY-MM-DD dates. */
export function bookingDays(startDate: string, endDate: string): number {
  const ms = Date.parse(endDate) - Date.parse(startDate);
  return Number.isFinite(ms) && ms >= 0 ? Math.round(ms / 86_400_000) + 1 : 0;
}

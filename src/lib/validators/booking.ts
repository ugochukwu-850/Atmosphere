import { z } from "zod";

/** Booking (location), rental (gear) or hire (talent) request. Dates are YYYY-MM-DD. */
export const bookingRequestSchema = z
  .object({
    startDate: z.iso.date({ error: "Pick a start date" }),
    endDate: z.iso.date({ error: "Pick an end date" }),
    note: z.string().trim().max(1000, "Note must be 1000 characters or fewer").optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

/** Inclusive day count between two YYYY-MM-DD dates. */
export function bookingDays(startDate: string, endDate: string): number {
  const ms = Date.parse(endDate) - Date.parse(startDate);
  return Number.isFinite(ms) && ms >= 0 ? Math.round(ms / 86_400_000) + 1 : 0;
}

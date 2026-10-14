import { z } from "zod";

/** Example schema: a booking request for a listing (location, gear or talent). */
export const bookingRequestSchema = z
  .object({
    startDate: z.coerce.date({ error: "Start date is required" }),
    endDate: z.coerce.date({ error: "End date is required" }),
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

export type BookingRequestInput = z.input<typeof bookingRequestSchema>;
export type BookingRequest = z.output<typeof bookingRequestSchema>;

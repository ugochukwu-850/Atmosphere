import { BookingUnavailable } from "@/components/bookings/BookingUnavailable";

/** Rendered by notFound() in the booking page (unknown id or API 404). */
export default function BookingNotFound() {
  return <BookingUnavailable reason="not_found" />;
}

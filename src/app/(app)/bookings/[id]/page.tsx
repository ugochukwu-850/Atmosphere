import type { Metadata } from "next";

import { ComingSoon } from "@/components/detail/ComingSoon";

export const metadata: Metadata = { title: "Booking" };

export default function BookingPage() {
  return (
    <ComingSoon
      crumb="Bookings"
      title="Booking details"
      description="The booking thread — status, payment, messages and gear handoffs — is being rebuilt."
      back={{ href: "/bookings", label: "Back to bookings" }}
    />
  );
}

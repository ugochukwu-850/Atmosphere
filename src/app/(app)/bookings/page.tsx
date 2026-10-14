import type { Metadata } from "next";

import { ComingSoon } from "@/components/detail/ComingSoon";

export const metadata: Metadata = { title: "Bookings" };

export default function BookingsPage() {
  return (
    <ComingSoon
      crumb="Bookings"
      title="Your bookings"
      description="Track requests, payment state, messages and gear handoffs for everything you've booked or listed."
    />
  );
}

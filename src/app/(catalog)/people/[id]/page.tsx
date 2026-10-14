import type { Metadata } from "next";

import { ComingSoon } from "@/components/detail/ComingSoon";

export const metadata: Metadata = { title: "Profile" };

export default function PersonPage() {
  return (
    <ComingSoon
      crumb="Profile"
      title="Creative profile"
      description="Public profiles with listings, specialties and social feeds are being rebuilt."
      back={{ href: "/cast", label: "Back to talent" }}
    />
  );
}

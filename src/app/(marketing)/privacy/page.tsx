import type { Metadata } from "next";

import { ComingSoon } from "@/components/detail/ComingSoon";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <ComingSoon
      crumb="Privacy and Policy"
      title="Privacy Policy"
      description="How ArtMostSphere collects and uses your data, in line with the NDPR."
    />
  );
}

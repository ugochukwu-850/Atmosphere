import type { Metadata } from "next";

import { ComingSoon } from "@/components/detail/ComingSoon";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <ComingSoon
      crumb="Terms and Conditions"
      title="Terms and Conditions"
      description="The terms for using ArtMostSphere as a renter, provider or creative."
    />
  );
}

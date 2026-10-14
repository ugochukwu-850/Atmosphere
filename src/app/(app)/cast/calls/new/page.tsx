import type { Metadata } from "next";

import { ComingSoon } from "@/components/detail/ComingSoon";

export const metadata: Metadata = { title: "Post a call" };

export default function NewCastingCallPage() {
  return (
    <ComingSoon
      crumb="Post a casting call"
      title="Post a casting call"
      description="Describe the role, the shoot and where it happens. Talent can then express interest from the casting board."
      back={{ href: "/cast/calls", label: "Back to casting calls" }}
    />
  );
}

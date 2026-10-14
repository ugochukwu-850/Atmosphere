import type { Metadata } from "next";

import { ComingSoon } from "@/components/detail/ComingSoon";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <ComingSoon
      crumb="Account"
      title="Your account"
      description="Update your profile, add roles, connect social accounts and choose your theme."
    />
  );
}

import type { Metadata } from "next";

import { ComingSoon } from "@/components/detail/ComingSoon";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <ComingSoon
      crumb="Contact Us"
      title="Contact us"
      description="Questions, partnerships or something not working? We'd love to hear from you."
    />
  );
}

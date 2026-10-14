import type { Metadata } from "next";

import { ComingSoon } from "@/components/detail/ComingSoon";

export const metadata: Metadata = { title: "List something" };

export default function ListPage() {
  return (
    <ComingSoon
      crumb="List something"
      title="List your space, gear or talent"
      description="Share a location, rent out or sell kit, or publish your creative profile. New listings are reviewed before they go live."
    />
  );
}

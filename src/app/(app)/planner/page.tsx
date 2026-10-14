import type { Metadata } from "next";

import { ComingSoon } from "@/components/detail/ComingSoon";

export const metadata: Metadata = { title: "Planner" };

export default function PlannerPage() {
  return (
    <ComingSoon
      crumb="Production Planner"
      title="Plan a shoot"
      description="Describe your idea and get the kit, shot types, talent, timeline and budget your production needs — matched to what you can book."
    />
  );
}

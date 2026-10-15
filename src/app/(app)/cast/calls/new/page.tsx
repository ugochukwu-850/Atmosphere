import type { Metadata } from "next";
import { Suspense } from "react";

import { CastingCallForm } from "@/components/listing-form/CastingCallForm";
import { FormSkeleton } from "@/components/listing-form/FormSkeleton";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { getArea } from "@/lib/area/server";
import { requireUser } from "@/lib/auth/require";
import { lagosToday } from "@/lib/validators/casting";

export const metadata: Metadata = { title: "Post a call" };

export default function NewCastingCallPage() {
  return (
    <WorkspacePage
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/cast", label: "Talent and Cast" },
        { href: "/cast/calls", label: "Casting calls" },
        { label: "Post a call" },
      ]}
      eyebrow="Casting"
      title="Post a casting call"
      description="Describe the role, the shoot and where it happens. Talent can then express interest from the casting board."
    >
      <div className="max-w-[56rem] md:pl-[22px]">
        {/* Reads the session and area cookies, so it streams in. */}
        <Suspense fallback={<FormSkeleton />}>
          <CallFormForUser />
        </Suspense>
      </div>
    </WorkspacePage>
  );
}

async function CallFormForUser() {
  const [, area] = await Promise.all([
    requireUser("/cast/calls/new"),
    getArea(),
  ]);
  return <CastingCallForm defaultArea={area} today={lagosToday()} />;
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { FormSkeleton } from "@/components/listing-form/FormSkeleton";
import { ListingForm } from "@/components/listing-form/ListingForm";
import { ButtonLink } from "@/components/ui/button";
import { Panel, WorkspacePage } from "@/components/workspace/WorkspacePage";
import { getArea } from "@/lib/area/server";
import { hasRole, requireUser } from "@/lib/auth/require";
import { kindsForRoles } from "@/lib/validators/listing";

export const metadata: Metadata = { title: "List something" };

export default function ListPage() {
  return (
    <WorkspacePage
      crumbs={[{ href: "/", label: "Home" }, { label: "List something" }]}
      eyebrow="Become a provider"
      title="List your space, gear or talent"
      description="Share a location, rent out or sell kit, or publish your creative profile. New listings are reviewed before they go live."
    >
      <div className="max-w-[56rem] md:pl-[22px]">
        {/* Reads the session and area cookies, so it streams in. */}
        <Suspense fallback={<FormSkeleton />}>
          <ListingFormForUser />
        </Suspense>
      </div>
    </WorkspacePage>
  );
}

async function ListingFormForUser() {
  const [{ user }, area] = await Promise.all([requireUser("/list"), getArea()]);
  const kinds = kindsForRoles(user.roles);

  if (kinds.length === 0) {
    return (
      <Panel
        title="Add a provider role to list"
        description="Listing is for providers. Your account is set up to book and rent."
      >
        <p className="text-lg leading-relaxed text-muted-foreground">
          Locations and gear need the <strong>owner</strong> role. A creator
          profile needs the <strong>talent</strong> role. Add either from your
          account, then come back here.
        </p>
        <ButtonLink
          href="/account"
          size="lg"
          className="h-[56px] self-start px-10 text-sm font-normal"
        >
          Add a role in your account
        </ButtonLink>
      </Panel>
    );
  }

  const owner = hasRole(user, "owner");
  const talent = hasRole(user, "talent");
  return (
    <div className="flex flex-col gap-6">
      <ListingForm kinds={kinds} defaultArea={area} />
      {owner !== talent && (
        <p className="text-sm text-muted-foreground">
          {owner
            ? "Want to be hired as cast or crew too? "
            : "Own a space or kit you'd like to list? "}
          <Link
            href="/account"
            className="font-semibold text-primary hover:underline"
          >
            Add the {owner ? "talent" : "owner"} role in your account
          </Link>
          .
        </p>
      )}
    </div>
  );
}

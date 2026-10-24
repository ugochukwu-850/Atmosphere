import type { Metadata } from "next";
import { Suspense } from "react";

import { ProfileForm } from "@/components/account/ProfileForm";
import { RolesForm } from "@/components/account/RolesForm";
import { SocialForm } from "@/components/account/SocialForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ButtonLink } from "@/components/ui/button";
import {
  Notice,
  Panel,
  WorkspacePage,
} from "@/components/workspace/WorkspacePage";
import { requireUser } from "@/lib/auth/require";
import { getCurrentUser } from "@/lib/auth/session";
import { getAccount } from "@/lib/data/account";

export const metadata: Metadata = { title: "Account" };

// Same column split as the detail pages (876 / 475 at 1512).
const COLUMNS =
  "grid gap-6 lg:grid-cols-[minmax(0,876fr)_minmax(0,475fr)] lg:gap-[55px]";

export default function AccountPage() {
  return (
    <WorkspacePage
      crumbs={[{ href: "/", label: "Home" }, { label: "Account" }]}
      eyebrow="Account"
      title="Your account"
      description="Update your profile, add roles, connect social accounts and choose your theme."
      actions={
        <Suspense fallback={null}>
          <PublicProfileLink />
        </Suspense>
      }
    >
      {/* The session is request-time data, so the panels stream in. */}
      <Suspense fallback={<AccountSkeleton />}>
        <AccountPanels />
      </Suspense>
    </WorkspacePage>
  );
}

async function PublicProfileLink() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <ButtonLink href={`/people/${user.id}`} variant="outline" size="lg">
      View public profile
    </ButtonLink>
  );
}

async function AccountPanels() {
  const { token } = await requireUser("/account");
  const account = await getAccount(token).catch(() => null);
  if (!account) {
    return (
      <Notice tone="error">
        We couldn&apos;t load your account. Refresh the page to try again.
      </Notice>
    );
  }

  return (
    <div className={COLUMNS}>
      <div className="flex flex-col gap-6">
        <Panel
          title="Profile"
          description="Shown on your public profile, your listings and your casting calls."
        >
          <ProfileForm
            email={account.email}
            defaults={{
              name: account.name,
              phone: account.phone ?? "",
              neighborhood: account.neighborhood ?? "",
              specialties: account.specialties.join(", "),
              bio: account.bio ?? "",
            }}
          />
        </Panel>
        <Panel
          title="Social accounts"
          description="Add your handles. Pick one platform to show its latest posts on your public profile."
        >
          <SocialForm socials={account.socials} />
        </Panel>
      </div>

      <div className="flex flex-col gap-6">
        <Panel
          title="Roles"
          description="Roles unlock parts of ArtMostSphere. Add one whenever you need it."
        >
          <RolesForm roles={account.roles} />
        </Panel>
        <Panel
          title="Appearance"
          description="Light is the default. System follows your device."
        >
          <ThemeToggle className="self-start" />
        </Panel>
      </div>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className={COLUMNS} aria-hidden>
      {[
        ["h-[34rem]", "h-[28rem]"],
        ["h-80", "h-40"],
      ].map((column, i) => (
        <div key={i} className="flex flex-col gap-6">
          {column.map((height) => (
            <div
              key={height}
              className={`${height} animate-pulse rounded-xl border bg-card`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

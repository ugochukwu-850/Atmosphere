import type { Metadata } from "next";
import { redirect, unstable_rethrow } from "next/navigation";
import { Suspense } from "react";

import {
  BookingList,
  BookingListSkeleton,
  type BookingSide,
} from "@/components/bookings/BookingList";
import { EmptyState } from "@/components/catalog/EmptyState";
import { UnderlineTabs } from "@/components/catalog/UnderlineTabs";
import { ButtonLink } from "@/components/ui/button";
import { Notice, WorkspacePage } from "@/components/workspace/WorkspacePage";
import { ApiError } from "@/lib/api/client";
import { requireUser } from "@/lib/auth/require";
import { listBookings } from "@/lib/data/bookings";
import type { BookingSummary } from "@/lib/data/types";
import { apiErrorMessage } from "@/lib/forms";
import { param, withParams } from "@/lib/search-params";

export const metadata: Metadata = { title: "Bookings" };

const TABS: { key: BookingSide; label: string }[] = [
  { key: "sent", label: "Requests you sent" },
  { key: "incoming", label: "Requests for your listings" },
];

const EMPTY: Record<
  BookingSide,
  {
    title: string;
    description: string;
    action: { href: string; label: string };
  }
> = {
  sent: {
    title: "No requests sent yet",
    description:
      "Find a location, a kit or talent and send a request. It shows up here so you can follow it and message the provider.",
    action: { href: "/locations", label: "Browse locations" },
  },
  incoming: {
    title: "No requests for your listings yet",
    description:
      "When someone requests one of your listings, it lands here for you to accept or decline.",
    action: { href: "/list", label: "List something" },
  },
};

export default function BookingsPage({ searchParams }: PageProps<"/bookings">) {
  return (
    <WorkspacePage
      crumbs={[{ href: "/", label: "Home" }, { label: "Bookings" }]}
      eyebrow="Bookings"
      title="Your bookings"
      description="Requests you've sent and requests for your listings. Open one to message, confirm payment or log a gear handoff."
    >
      {/* searchParams and the session cookie are request-time data. */}
      <Suspense fallback={<BookingListSkeleton />}>
        <BookingsContent searchParams={searchParams} />
      </Suspense>
    </WorkspacePage>
  );
}

async function BookingsContent({
  searchParams,
}: Pick<PageProps<"/bookings">, "searchParams">) {
  const [{ user, token }, sp] = await Promise.all([
    requireUser("/bookings"),
    searchParams,
  ]);

  let bookings: BookingSummary[];
  try {
    bookings = await listBookings(token);
  } catch (err) {
    unstable_rethrow(err);
    if (err instanceof ApiError && err.status === 401)
      redirect(`/login?next=${encodeURIComponent("/bookings")}`);
    return (
      <Notice tone="error">
        Could not load your bookings. {apiErrorMessage(err)}
      </Notice>
    );
  }

  const lists: Record<BookingSide, BookingSummary[]> = {
    sent: bookings.filter((b) => b.renter?.id === user.id),
    incoming: bookings.filter((b) => b.owner?.id === user.id),
  };
  // Without ?tab=, open on incoming requests when that's all there is.
  const requested = param(sp, "tab");
  const tab: BookingSide =
    requested === "sent" || requested === "incoming"
      ? requested
      : lists.sent.length === 0 && lists.incoming.length > 0
        ? "incoming"
        : "sent";
  const shown = lists[tab];
  const empty = EMPTY[tab];

  return (
    <div className="flex flex-col gap-6">
      <UnderlineTabs
        label="Booking side"
        activeKey={tab}
        tabs={TABS.map((t) => ({
          key: t.key,
          label: `${t.label} (${lists[t.key].length})`,
          href: withParams("/bookings", { tab: t.key }),
        }))}
      />
      {shown.length === 0 ? (
        <EmptyState
          title={empty.title}
          description={empty.description}
          action={
            <ButtonLink
              href={empty.action.href}
              variant="outline"
              className="mt-2"
            >
              {empty.action.label}
            </ButtonLink>
          }
        />
      ) : (
        <BookingList bookings={shown} side={tab} />
      )}
    </div>
  );
}

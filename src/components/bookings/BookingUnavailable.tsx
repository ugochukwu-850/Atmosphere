import { ChevronLeft } from "lucide-react";

import { WIDE } from "@/components/catalog/SearchBand";
import { Callout } from "@/components/detail/Sections";
import { ButtonLink } from "@/components/ui/button";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";

const COPY = {
  not_found: {
    title: "We can't find that booking",
    description:
      "It may have been removed, or the link is incomplete. Your bookings list has everything you've sent and received.",
    callout: {
      title: "Looking for a request you just sent?",
      text: "New requests appear under Requests you sent straight away.",
    },
  },
  forbidden: {
    title: "This booking isn't yours",
    description:
      "Only the renter and the listing owner can open a booking thread.",
    callout: {
      title: "Signed in with another account?",
      text: "Sign out and back in with the account that sent or received the request.",
    },
  },
  error: {
    title: "This booking didn't load",
    description:
      "The bookings service didn't answer. Refresh in a moment to try again.",
    callout: {
      title: "Still stuck?",
      text: "If it keeps happening, tell us from the contact page.",
    },
  },
} as const;

/** 404, 403 and load-failure states for a booking thread. */
export function BookingUnavailable({ reason }: { reason: keyof typeof COPY }) {
  const copy = COPY[reason];
  return (
    <WorkspacePage
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/bookings", label: "Bookings" },
        { label: "Booking" },
      ]}
      eyebrow="Bookings"
      title={copy.title}
      description={copy.description}
    >
      <div className="flex max-w-[48rem] flex-col gap-8 md:pl-[22px]">
        <Callout title={copy.callout.title}>{copy.callout.text}</Callout>
        <ButtonLink
          href="/bookings"
          variant="outline"
          className="h-12 self-start px-5 text-sm font-normal"
        >
          <ChevronLeft className="size-4" />
          Back to bookings
        </ButtonLink>
      </div>
    </WorkspacePage>
  );
}

/** Fallback while a booking thread loads: header bars and the two columns. */
export function BookingThreadSkeleton() {
  return (
    <div className="pb-24" aria-hidden>
      <div className={`${WIDE} pt-10 md:pt-20`}>
        <div className="flex flex-col gap-6 md:pl-[22px]">
          <div className="h-3 w-48 animate-pulse rounded-xs bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded-xs bg-muted" />
          <div className="h-14 w-2/3 animate-pulse rounded-xs bg-muted" />
        </div>
      </div>
      <div
        className={`${WIDE} mt-14 grid gap-12 lg:grid-cols-[minmax(0,876fr)_minmax(0,475fr)] lg:gap-[55px]`}
      >
        <div className="h-96 animate-pulse rounded-xl bg-card" />
        <div className="h-80 animate-pulse rounded-xl bg-card" />
      </div>
    </div>
  );
}

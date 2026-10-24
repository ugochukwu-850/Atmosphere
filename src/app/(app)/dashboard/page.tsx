import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { CardGrid } from "@/components/catalog/CatalogCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { GridSkeleton } from "@/components/catalog/GridSkeleton";
import { ItemCard } from "@/components/catalog/ItemCard";
import {
  DASHBOARD_PAGE,
  DashboardHeading,
  StatTile,
} from "@/components/dashboard/DashboardPage";
import { HeroSearchCard } from "@/components/search/SearchForms";
import { ButtonLink } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/require";
import { listBookings } from "@/lib/data/bookings";
import { getSavedIds, getSavedItems } from "@/lib/data/saved";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className={DASHBOARD_PAGE}>
      <CreateHero />

      <DashboardHeading
        className="mt-[35px]"
        title="Welcome back to your creative space."
        description="Pick up where your production search left off. Your shortlist, booking requests and account activity live here."
      />

      {/* Saved items and bookings are request-time data (cookies, session). */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>

      <div className="mt-[34px] flex items-center justify-between gap-4">
        <h2 className="font-sans text-[26px] leading-tight font-medium md:text-[31px]">
          Your saved shortlist
        </h2>
        <Link
          href="/saved"
          className="shrink-0 text-base text-primary hover:underline"
        >
          See saved items
        </Link>
      </div>
      <div className="mt-8">
        <Suspense fallback={<GridSkeleton count={3} />}>
          <Shortlist />
        </Suspense>
      </div>
    </div>
  );
}

/** Blurred photo card with "What are you creating?" and the catalog search. */
function CreateHero() {
  return (
    <section className="relative isolate flex min-h-[428px] flex-col overflow-hidden rounded-[20px] px-[15px] pt-10 pb-[15px] md:pt-[49px] md:pb-[26px]">
      <Image
        src="/images/dashboard/hero.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 1150px, 100vw"
        className="-z-10 scale-110 object-cover blur-[13.5px]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[rgb(27_7_0/0.64)]"
      />
      <div className="flex max-w-[706px] flex-col gap-[9px] px-4 text-white md:px-8">
        <h2 className="font-sans text-[26px] leading-tight font-semibold md:text-[31px]">
          What are you creating?
        </h2>
        <p className="text-base">
          Search locations, gear, talent and production support. You can browse
          first and sign in when you are ready to take action.
        </p>
      </div>
      <HeroSearchCard className="mt-10 rounded-[20px] shadow-none md:mt-auto" />
    </section>
  );
}

async function Stats() {
  const [{ token }, savedIds] = await Promise.all([
    requireUser("/dashboard"),
    getSavedIds(),
  ]);
  // A failed bookings call shouldn't take the dashboard down with it.
  const bookings = await listBookings(token).catch(() => null);
  const pending = bookings?.filter((b) => b.status === "requested").length;

  return (
    <div className="mt-8 grid gap-2.5 sm:grid-cols-3">
      <StatTile label="Saved places" value={savedIds.length} />
      <StatTile label="Booking request" value={pending ?? "–"} />
      {/* No notifications API yet, so there is nothing unread to count. */}
      <StatTile label="Unread update" value={0} />
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="mt-8 grid gap-2.5 sm:grid-cols-3" aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className="min-h-[129px] animate-pulse rounded-md bg-muted"
        />
      ))}
    </div>
  );
}

async function Shortlist() {
  const items = await getSavedItems(await getSavedIds(), 3);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        description="Tap the bookmark on any location, kit or talent card and it lands here, ready for your next shoot."
        action={
          <ButtonLink href="/locations" variant="outline">
            Browse locations
          </ButtonLink>
        }
      />
    );
  }

  return (
    <CardGrid>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} refreshOnSave />
      ))}
    </CardGrid>
  );
}

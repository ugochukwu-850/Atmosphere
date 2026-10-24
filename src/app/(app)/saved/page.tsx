import type { Metadata } from "next";
import { Suspense } from "react";

import { CardGrid } from "@/components/catalog/CatalogCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { GridSkeleton } from "@/components/catalog/GridSkeleton";
import { ItemCard } from "@/components/catalog/ItemCard";
import {
  DASHBOARD_PAGE,
  DashboardHeading,
} from "@/components/dashboard/DashboardPage";
import { ButtonLink } from "@/components/ui/button";
import { getSavedIds, getSavedItems } from "@/lib/data/saved";

export const metadata: Metadata = { title: "Saved items" };

export default function SavedPage() {
  return (
    <div className={DASHBOARD_PAGE}>
      <DashboardHeading title="Your saved shortlist" />
      <div className="mt-8">
        {/* Saved ids live in a cookie, so the grid is request-time data. */}
        <Suspense fallback={<GridSkeleton />}>
          <SavedGrid />
        </Suspense>
      </div>
    </div>
  );
}

async function SavedGrid() {
  const items = await getSavedItems(await getSavedIds());

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        description="Tap the bookmark on any location, kit or talent card to keep it here while you plan."
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

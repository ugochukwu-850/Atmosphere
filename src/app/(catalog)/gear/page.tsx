import type { Metadata } from "next";
import { Suspense } from "react";

import { GearResults } from "@/components/catalog/GearResults";
import { GridSkeleton } from "@/components/catalog/GridSkeleton";
import { ResultsSection } from "@/components/catalog/Results";
import { SearchBand } from "@/components/catalog/SearchBand";

export const metadata: Metadata = { title: "Rent gear" };

export default function GearPage({ searchParams }: PageProps<"/gear">) {
  return (
    <>
      <SearchBand
        crumbs={[{ href: "/", label: "Home" }, { label: "Gear" }]}
        title={
          <>
            Find the <span className="text-sand">kit</span> your
            <br />
            shoot needs.
          </>
        }
        intro="Cameras, lenses, lights and sound from owners and rental houses. Browse freely—sign in only when you're ready to request a rental."
        note={{
          title: "From cinema cameras to lighting kits",
          text: "Rent by the day from people closest to your set.",
        }}
      />
      <Suspense
        fallback={
          <ResultsSection title="Kit for the shoot" summary="Loading kit…">
            <GridSkeleton />
          </ResultsSection>
        }
      >
        <GearResults sale={false} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

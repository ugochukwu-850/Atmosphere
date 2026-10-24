import type { Metadata } from "next";
import { Suspense } from "react";

import { GearResults } from "@/components/catalog/GearResults";
import { GridSkeleton } from "@/components/catalog/GridSkeleton";
import { ResultsSection } from "@/components/catalog/Results";
import { SearchBand } from "@/components/catalog/SearchBand";

export const metadata: Metadata = { title: "Buy gear" };

export default function GearSalePage({
  searchParams,
}: PageProps<"/gear/sale">) {
  return (
    <>
      <SearchBand
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/gear", label: "Gear" },
          { label: "Buy" },
        ]}
        title={
          <>
            Used <span className="text-sand">kit</span> from
            <br />
            people who shoot.
          </>
        }
        intro="Browse what owners are asking for cameras, lenses and lights they no longer need. Contact the seller from the listing."
        note={{
          title: "Fair asking prices",
          text: "Purchase requests and checkout are coming soon.",
        }}
      />
      <Suspense
        fallback={
          <ResultsSection title="Used kit for sale" summary="Loading kit…">
            <GridSkeleton />
          </ResultsSection>
        }
      >
        <GearResults sale searchParams={searchParams} />
      </Suspense>
    </>
  );
}

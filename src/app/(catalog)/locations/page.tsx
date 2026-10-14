import type { Metadata } from "next";

import { ListingCatalog, ListingSearchBar, type CatalogConfig } from "@/components/catalog/ListingCatalog";
import { PageHero } from "@/components/catalog/PageHero";

export const metadata: Metadata = { title: "Locations" };

const config: CatalogConfig = {
  kind: "location",
  basePath: "/locations",
  searchPlaceholder: "Search studios, houses, neighborhoods…",
  scoutPins: true,
  chips: [
    { label: "All" },
    { label: "Studio", value: "studio" },
    { label: "Stage", value: "stage" },
    { label: "Apartment", value: "apartment" },
    { label: "House", value: "house" },
    { label: "Gallery", value: "gallery" },
  ],
};

export default function LocationsPage({ searchParams }: PageProps<"/locations">) {
  return (
    <>
      <PageHero
        eyebrow="Locations"
        title={
          <>
            Find a place that
            <br />
            fits the frame.
          </>
        }
        description="Studios, homes and public spots across the catalog. Squares on the map are bookable; dots are scout-only."
      >
        <ListingSearchBar config={config} searchParams={searchParams} />
      </PageHero>
      <ListingCatalog config={config} searchParams={searchParams} />
    </>
  );
}

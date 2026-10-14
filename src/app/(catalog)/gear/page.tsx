import type { Metadata } from "next";

import { GearTabs } from "@/components/catalog/GearTabs";
import { GEAR_CHIPS } from "@/components/catalog/gear-chips";
import { ListingCatalog, ListingSearchBar, type CatalogConfig } from "@/components/catalog/ListingCatalog";
import { PageHero } from "@/components/catalog/PageHero";

export const metadata: Metadata = { title: "Rent gear" };

const config: CatalogConfig = {
  kind: "gear",
  basePath: "/gear",
  searchPlaceholder: "Search cameras, lenses, lights…",
  chips: GEAR_CHIPS,
  tabs: <GearTabs active="/gear" />,
};

export default function GearPage({ searchParams }: PageProps<"/gear">) {
  return (
    <>
      <PageHero
        eyebrow="Rent gear"
        title={
          <>
            Kit closest
            <br />
            to the shoot.
          </>
        }
        description="Cameras, lenses and lights from people and rental houses. The closest kit ranks first when you set a city."
      >
        <ListingSearchBar config={config} searchParams={searchParams} />
      </PageHero>
      <ListingCatalog config={config} searchParams={searchParams} />
    </>
  );
}

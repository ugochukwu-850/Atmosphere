import type { Metadata } from "next";

import { GearTabs } from "@/components/catalog/GearTabs";
import { GEAR_CHIPS } from "@/components/catalog/gear-chips";
import {
  ListingCatalog,
  ListingSearchBar,
  type CatalogConfig,
} from "@/components/catalog/ListingCatalog";
import { PageHero } from "@/components/catalog/PageHero";

export const metadata: Metadata = { title: "Buy gear" };

const config: CatalogConfig = {
  kind: "gear_sale",
  basePath: "/gear/sale",
  searchPlaceholder: "Search used cameras, lenses, lights…",
  chips: GEAR_CHIPS,
  tabs: <GearTabs active="/gear/sale" />,
};

export default function GearSalePage({
  searchParams,
}: PageProps<"/gear/sale">) {
  return (
    <>
      <PageHero
        eyebrow="Buy gear"
        title={
          <>
            Used kit,
            <br />
            fair asking prices.
          </>
        }
        description="Browse what sellers are asking. Purchase requests and checkout are coming soon."
      >
        <ListingSearchBar config={config} searchParams={searchParams} />
      </PageHero>
      <ListingCatalog config={config} searchParams={searchParams} />
    </>
  );
}

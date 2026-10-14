import { Suspense } from "react";

import { MapLegend } from "@/components/map/MapLegend";
import { MapView } from "@/components/map/MapView";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/typography";
import type { ListingKind } from "@/lib/api/generated";
import { areaCenter, areaLabel } from "@/lib/area/area";
import { getArea } from "@/lib/area/server";
import { listScoutPins, searchListings } from "@/lib/data/catalog";
import { param, pageParam } from "@/lib/search-params";
import type { MapMarker } from "@/types/map";

import { EmptyState } from "./EmptyState";
import { FilterChips, type Chip } from "./FilterChips";
import { GridSkeleton } from "./GridSkeleton";
import { ListingCard, listingPrice } from "./ListingCard";
import { Pagination } from "./Pagination";
import { placeLabel } from "./place";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export type CatalogConfig = {
  kind: ListingKind;
  basePath: string;
  searchPlaceholder: string;
  chips: Chip[];
  /** Show discovery-only scout pins on the map (locations). */
  scoutPins?: boolean;
  /** Extra controls above the grid, e.g. the rent/buy tabs. */
  tabs?: React.ReactNode;
};

/**
 * Search + filters + grid/map for listings. The hero is rendered by the page;
 * everything that reads the URL or the area cookie streams in here.
 */
export function ListingSearchBar({
  config,
  searchParams,
}: {
  config: CatalogConfig;
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<SearchBar action={config.basePath} placeholder={config.searchPlaceholder} />}>
      <SearchBarWithQuery config={config} searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchBarWithQuery({ config, searchParams }: { config: CatalogConfig; searchParams: SearchParams }) {
  const sp = await searchParams;
  return (
    <SearchBar
      action={config.basePath}
      placeholder={config.searchPlaceholder}
      defaultValue={param(sp, "q")}
      hidden={{ category: param(sp, "category"), view: param(sp, "view") }}
    />
  );
}

export function ListingCatalog({ config, searchParams }: { config: CatalogConfig; searchParams: SearchParams }) {
  return (
    <Container className="flex flex-col gap-6 py-10">
      {config.tabs}
      <Suspense fallback={<GridSkeleton />}>
        <Results config={config} searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function Results({ config, searchParams }: { config: CatalogConfig; searchParams: SearchParams }) {
  const sp = await searchParams;
  const area = await getArea();
  const q = param(sp, "q");
  const category = param(sp, "category");
  const view = param(sp, "view") === "map" ? "map" : "grid";
  const page = pageParam(sp);
  const params = { q, category, view: view === "map" ? "map" : undefined };

  const [result, pins] = await Promise.all([
    searchListings({ kind: config.kind, category, q, area, page }),
    config.scoutPins && view === "map" ? listScoutPins(area) : Promise.resolve([]),
  ]);

  const markers: MapMarker[] = [
    ...result.items
      .filter((l) => l.place.lat !== undefined && l.place.lng !== undefined)
      .map((l) => ({
        id: l.id,
        title: l.title,
        subtitle: [placeLabel(l.place), listingPrice(l)].filter(Boolean).join(" · "),
        lat: l.place.lat!,
        lng: l.place.lng!,
        kind: "bookable" as const,
        href: `/listings/${l.id}`,
      })),
    ...pins.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.note,
      lat: p.lat,
      lng: p.lng,
      kind: "scout" as const,
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <FilterChips basePath={config.basePath} param="category" chips={config.chips} active={category} params={params} />
        <ViewToggle basePath={config.basePath} view={view} params={{ q, category }} />
      </div>
      <p className="text-sm text-muted-foreground">
        {result.total} result{result.total === 1 ? "" : "s"} in {areaLabel(area)}
        {q ? ` for “${q}”` : ""}
      </p>

      {result.total === 0 && pins.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="Try another filter, widen the production area, or list your own."
          action={
            <ButtonLink href="/list" variant="outline">
              List something
            </ButtonLink>
          }
        />
      ) : view === "map" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="order-2 grid content-start gap-6 sm:grid-cols-2 lg:order-1">
            {result.items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="order-1 flex flex-col gap-3 lg:order-2">
            <MapView center={areaCenter(area)} markers={markers} className="h-[420px] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]" />
            {config.scoutPins && <MapLegend />}
          </div>
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      <Pagination basePath={config.basePath} page={result.page} pageSize={result.pageSize} total={result.total} params={params} />
    </div>
  );
}

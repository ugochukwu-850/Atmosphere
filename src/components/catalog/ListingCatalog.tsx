import { Suspense, type ReactNode } from "react";

import { MapLegend } from "@/components/map/MapLegend";
import { MapView } from "@/components/map/MapView";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/typography";
import { areaCenter, areaLabel } from "@/lib/area/area";
import { getArea } from "@/lib/area/server";
import { searchGear, searchLocations } from "@/lib/data/catalog";
import type { CatalogItem, ScoutPin } from "@/lib/data/types";
import { param } from "@/lib/search-params";
import type { MapMarker } from "@/types/map";

import { EmptyState } from "./EmptyState";
import { FilterChips, type Chip } from "./FilterChips";
import { GridSkeleton } from "./GridSkeleton";
import { itemPrice, ListingCard } from "./ListingCard";
import { placeLabel } from "./place";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export type CatalogConfig = {
  kind: "location" | "gear" | "gear_sale";
  basePath: string;
  searchPlaceholder: string;
  chips: Chip[];
  /** Extra controls above the grid, e.g. the rent/buy tabs. */
  tabs?: ReactNode;
};

/** Hero search box; reads `?q=` so it streams in behind Suspense. */
export function ListingSearchBar({ config, searchParams }: { config: CatalogConfig; searchParams: SearchParams }) {
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

/** Filters + grid/map for locations and gear. Everything here depends on the URL and area cookie. */
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

function toMarkers(items: CatalogItem[], pins: ScoutPin[]): MapMarker[] {
  return [
    ...items.flatMap((item) =>
      item.lat !== undefined && item.lng !== undefined
        ? [
            {
              id: item.id,
              title: item.title,
              subtitle: [placeLabel(item), itemPrice(item)].filter(Boolean).join(" · "),
              lat: item.lat,
              lng: item.lng,
              kind: "bookable" as const,
              href: `/listings/${item.id}`,
            },
          ]
        : [],
    ),
    ...pins.map((pin) => ({
      id: pin.id,
      title: pin.title,
      subtitle: pin.accessNotes ?? pin.description,
      lat: pin.lat,
      lng: pin.lng,
      kind: "scout" as const,
    })),
  ];
}

async function Results({ config, searchParams }: { config: CatalogConfig; searchParams: SearchParams }) {
  const [sp, area] = await Promise.all([searchParams, getArea()]);
  const q = param(sp, "q");
  const category = param(sp, "category");
  const view = param(sp, "view") === "map" ? "map" : "grid";
  const params = { q, category, view: view === "map" ? "map" : undefined };

  const { items, pins } =
    config.kind === "location"
      ? await searchLocations({ area, q, category })
      : { items: await searchGear({ area, q, category, sale: config.kind === "gear_sale" }), pins: [] };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <FilterChips basePath={config.basePath} param="category" chips={config.chips} active={category} params={params} />
        <ViewToggle basePath={config.basePath} view={view} params={{ q, category }} />
      </div>
      <p className="text-sm text-muted-foreground">
        {items.length} result{items.length === 1 ? "" : "s"} in {areaLabel(area)}
        {q ? ` for “${q}”` : ""}
        {view === "map" && pins.length ? ` · ${pins.length} scout pins` : ""}
      </p>

      {items.length === 0 && pins.length === 0 ? (
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
            {items.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
          <div className="order-1 flex flex-col gap-3 lg:order-2">
            <MapView
              center={areaCenter(area)}
              markers={toMarkers(items, pins)}
              className="h-[420px] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]"
            />
            {pins.length > 0 && <MapLegend />}
          </div>
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

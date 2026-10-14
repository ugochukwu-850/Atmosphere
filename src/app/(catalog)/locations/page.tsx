import type { Metadata } from "next";
import { Suspense } from "react";

import {
  CardGrid,
  CardLinks,
  CatalogCard,
} from "@/components/catalog/CatalogCard";
import { CategorySelect } from "@/components/catalog/CategorySelect";
import { EmptyState } from "@/components/catalog/EmptyState";
import { GridSkeleton } from "@/components/catalog/GridSkeleton";
import { MapToggle } from "@/components/catalog/MapToggle";
import { Pagination } from "@/components/catalog/Pagination";
import { PinCard } from "@/components/catalog/PinCard";
import {
  paginate,
  ResultsMap,
  ResultsSection,
} from "@/components/catalog/Results";
import { SearchBand } from "@/components/catalog/SearchBand";
import { UnderlineTabs } from "@/components/catalog/UnderlineTabs";
import { ButtonLink } from "@/components/ui/button";
import { areaCenter, areaLabel } from "@/lib/area/area";
import { getArea } from "@/lib/area/server";
import { searchLocations } from "@/lib/data/catalog";
import type { CatalogItem, ScoutPin } from "@/lib/data/types";
import { titleCase } from "@/lib/format";
import { pageParam, param, withParams } from "@/lib/search-params";
import type { MapMarker } from "@/types/map";

export const metadata: Metadata = { title: "Locations" };

const TABS = [
  { key: "all", label: "All Places" },
  { key: "bookable", label: "Bookable Space" },
  { key: "scout", label: "Scout-only Places" },
] as const;

const CATEGORIES = [
  { value: "", label: "All types" },
  ...[
    "studio",
    "stage",
    "apartment",
    "house",
    "gallery",
    "landmark",
    "beach",
    "park",
  ].map((c) => ({
    value: c,
    label: titleCase(c),
  })),
];

type Result =
  { type: "listing"; item: CatalogItem } | { type: "pin"; pin: ScoutPin };

export default function LocationsPage({
  searchParams,
}: PageProps<"/locations">) {
  return (
    <>
      <SearchBand
        crumbs={[{ href: "/", label: "Home" }, { label: "Locations" }]}
        title={
          <>
            Find a <span className="text-sand">place</span> that
            <br />
            fits the frame.
          </>
        }
        intro="Explore bookable spaces and scouting spots for your next production. Browse the results first—sign in only when you're ready to contact a provider or request a booking."
        note={{
          title: "From Lagos streets to studio interiors",
          text: "Search a city, a space type, or the kind of scene you're trying to create.",
        }}
      />
      <Suspense fallback={<ResultsFallback />}>
        <LocationResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function ResultsFallback() {
  return (
    <ResultsSection title="Places to make the scene" summary="Loading places…">
      <GridSkeleton />
    </ResultsSection>
  );
}

async function LocationResults({
  searchParams,
}: Pick<PageProps<"/locations">, "searchParams">) {
  const [sp, area] = await Promise.all([searchParams, getArea()]);
  const q = param(sp, "q");
  const category = param(sp, "category");
  const tab = TABS.some((t) => t.key === param(sp, "tab"))
    ? param(sp, "tab")!
    : "all";
  const showMap = param(sp, "map") === "1";
  const base = {
    q,
    category,
    tab: tab === "all" ? undefined : tab,
    map: showMap ? "1" : undefined,
  };

  const { items, pins } = await searchLocations({ area, q, category });
  const results: Result[] = [
    ...(tab !== "scout"
      ? items.map((item) => ({ type: "listing" as const, item }))
      : []),
    ...(tab !== "bookable"
      ? pins.map((pin) => ({ type: "pin" as const, pin }))
      : []),
  ];
  const { pageItems, page, pages } = paginate(results, pageParam(sp));

  const markers = results.flatMap((r): MapMarker[] => {
    if (r.type === "pin") {
      return [
        {
          id: r.pin.id,
          title: r.pin.title,
          subtitle: r.pin.neighborhood,
          lat: r.pin.lat,
          lng: r.pin.lng,
          kind: "scout",
        },
      ];
    }
    const { item } = r;
    if (item.lat === undefined || item.lng === undefined) return [];
    return [
      {
        id: item.id,
        title: item.title,
        subtitle: `${item.neighborhood}, ${item.city}`,
        lat: item.lat,
        lng: item.lng,
        kind: "bookable",
        href: `/listings/${item.id}`,
      },
    ];
  });

  return (
    <ResultsSection
      title="Places to make the scene"
      summary={`${results.length} place${results.length === 1 ? "" : "s"} to explore in ${areaLabel(area)}. Browse details without signing in.`}
      controls={
        <>
          <CategorySelect
            action="/locations"
            value={category}
            options={CATEGORIES}
            keep={{ q, tab: base.tab, map: base.map }}
          />
          <MapToggle
            on={showMap}
            href={withParams("/locations", {
              ...base,
              map: showMap ? undefined : "1",
            })}
          />
        </>
      }
      tabs={
        <UnderlineTabs
          label="Place type"
          activeKey={tab}
          tabs={TABS.map((t) => ({
            key: t.key,
            label: t.label,
            href: withParams("/locations", {
              ...base,
              tab: t.key === "all" ? undefined : t.key,
            }),
          }))}
        />
      }
    >
      {showMap && markers.length > 0 && (
        <ResultsMap center={areaCenter(area)} markers={markers} />
      )}
      {results.length === 0 ? (
        <EmptyState
          title="No places match yet"
          description="Try another type, widen the production area, or list your own space."
          action={
            <ButtonLink href="/list" variant="outline">
              List a location
            </ButtonLink>
          }
        />
      ) : (
        <CardGrid>
          {pageItems.map((r) =>
            r.type === "pin" ? (
              <PinCard key={r.pin.id} pin={r.pin} />
            ) : (
              <CatalogCard
                key={r.item.id}
                id={r.item.id}
                href={`/listings/${r.item.id}`}
                photoUrl={r.item.photoUrl}
                badge={{ label: "Bookable", variant: "bookable" }}
                kicker={[r.item.category, r.item.neighborhood]
                  .filter(Boolean)
                  .join(" / ")}
                title={r.item.title}
                description={r.item.description}
                price={
                  r.item.dayRateNgn
                    ? { amountNgn: r.item.dayRateNgn, unit: "/ day" }
                    : undefined
                }
                actions={
                  <CardLinks
                    href={`/listings/${r.item.id}`}
                    secondary={{
                      label: "Request a booking",
                      href: `/listings/${r.item.id}?request=1`,
                    }}
                  />
                }
              />
            ),
          )}
        </CardGrid>
      )}
      <Pagination
        page={page}
        pages={pages}
        href={(p) =>
          withParams("/locations", { ...base, page: p > 1 ? p : undefined })
        }
      />
    </ResultsSection>
  );
}

import { areaCenter, areaLabel } from "@/lib/area/area";
import { getArea } from "@/lib/area/server";
import { searchGear } from "@/lib/data/catalog";
import type { CatalogItem } from "@/lib/data/types";
import { titleCase } from "@/lib/format";
import { pageParam, param, withParams } from "@/lib/search-params";
import type { MapMarker } from "@/types/map";

import { ButtonLink } from "../ui/button";
import { CardGrid, CardLinks, CatalogCard } from "./CatalogCard";
import { CategorySelect } from "./CategorySelect";
import { EmptyState } from "./EmptyState";
import { MapToggle } from "./MapToggle";
import { Pagination } from "./Pagination";
import { paginate, ResultsMap, ResultsSection } from "./Results";
import { UnderlineTabs } from "./UnderlineTabs";

const CATEGORIES = [
  { value: "", label: "All kit" },
  ...["camera", "lens", "lighting", "audio", "grip"].map((c) => ({
    value: c,
    label: titleCase(c),
  })),
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Rent / buy gear results, on the Location Search template. */
export async function GearResults({
  sale,
  searchParams,
}: {
  sale: boolean;
  searchParams: SearchParams;
}) {
  const path = sale ? "/gear/sale" : "/gear";
  const [sp, area] = await Promise.all([searchParams, getArea()]);
  const q = param(sp, "q");
  const category = param(sp, "category");
  const showMap = param(sp, "map") === "1";
  const base = { q, category, map: showMap ? "1" : undefined };

  const items = await searchGear({ area, q, category, sale });
  const { pageItems, page, pages } = paginate(items, pageParam(sp));
  const markers = items.flatMap((item): MapMarker[] =>
    item.lat !== undefined && item.lng !== undefined
      ? [
          {
            id: item.id,
            title: item.title,
            subtitle: `${item.neighborhood}, ${item.city}`,
            lat: item.lat,
            lng: item.lng,
            kind: "bookable",
            href: `/listings/${item.id}`,
          },
        ]
      : [],
  );

  return (
    <ResultsSection
      title={sale ? "Used kit for sale" : "Kit for the shoot"}
      summary={`${items.length} ${sale ? "item" : "rental"}${items.length === 1 ? "" : "s"} in ${areaLabel(area)}. ${
        sale
          ? "Purchase requests are coming soon."
          : "Closest kit ranks first when you set a city."
      }`}
      controls={
        <>
          <CategorySelect
            action={path}
            value={category}
            options={CATEGORIES}
            keep={{ q, map: base.map }}
          />
          <MapToggle
            on={showMap}
            href={withParams(path, { ...base, map: showMap ? undefined : "1" })}
          />
        </>
      }
      tabs={
        <UnderlineTabs
          label="Rent or buy"
          activeKey={sale ? "sale" : "rent"}
          tabs={[
            {
              key: "rent",
              label: "Rent by day",
              href: withParams("/gear", base),
            },
            {
              key: "sale",
              label: "Buy used gear",
              href: withParams("/gear/sale", base),
            },
          ]}
        />
      }
    >
      {showMap && markers.length > 0 && (
        <ResultsMap center={areaCenter(area)} markers={markers} />
      )}
      {items.length === 0 ? (
        <EmptyState
          title="No kit matches yet"
          description="Try another category, widen the production area, or list your own gear."
          action={
            <ButtonLink href="/list" variant="outline">
              List your gear
            </ButtonLink>
          }
        />
      ) : (
        <CardGrid>
          {pageItems.map((item) => (
            <GearCard key={item.id} item={item} sale={sale} />
          ))}
        </CardGrid>
      )}
      <Pagination
        page={page}
        pages={pages}
        href={(p) => withParams(path, { ...base, page: p > 1 ? p : undefined })}
      />
    </ResultsSection>
  );
}

function GearCard({ item, sale }: { item: CatalogItem; sale: boolean }) {
  const href = `/listings/${item.id}`;
  return (
    <CatalogCard
      id={item.id}
      href={href}
      photoUrl={item.photoUrl}
      badge={{ label: sale ? "For sale" : "For rent", variant: "bookable" }}
      kicker={[item.category, item.neighborhood].filter(Boolean).join(" / ")}
      title={item.title}
      description={item.description}
      price={
        sale
          ? item.salePriceNgn
            ? { amountNgn: item.salePriceNgn, unit: "asking" }
            : undefined
          : item.dayRateNgn
            ? { amountNgn: item.dayRateNgn, unit: "/ day" }
            : undefined
      }
      actions={
        <CardLinks
          href={href}
          secondary={
            sale
              ? { label: "Contact seller", href }
              : { label: "Request rental", href: `${href}?request=1` }
          }
        />
      }
    />
  );
}

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
import {
  paginate,
  ResultsMap,
  ResultsSection,
} from "@/components/catalog/Results";
import { SearchBand } from "@/components/catalog/SearchBand";
import { roleLabel, splitTalentTitle } from "@/components/catalog/talent";
import { UnderlineTabs } from "@/components/catalog/UnderlineTabs";
import { ButtonLink } from "@/components/ui/button";
import { areaCenter, areaLabel } from "@/lib/area/area";
import { getArea } from "@/lib/area/server";
import { getCastBoard } from "@/lib/data/catalog";
import { pageParam, param, withParams } from "@/lib/search-params";
import type { MapMarker } from "@/types/map";

export const metadata: Metadata = { title: "Talent and Cast" };

const ROLES = [
  { value: "", label: "All roles" },
  { value: "actor", label: "Actor" },
  { value: "model", label: "Model" },
  { value: "dp", label: "DP" },
  { value: "voice over", label: "Voice over" },
  { value: "sound", label: "Sound" },
  { value: "makeup", label: "Makeup" },
];

export default function CastPage({ searchParams }: PageProps<"/cast">) {
  return (
    <>
      <SearchBand
        crumbs={[{ href: "/", label: "Home" }, { label: "Talent and Cast" }]}
        title={
          <>
            Find the <span className="text-sand">people</span>
            <br />
            behind the frame.
          </>
        }
        intro="Actors, models, crew and voice artists across the catalog. Browse profiles freely—sign in only when you're ready to request a hire."
        note={{
          title: "From lead roles to location sound",
          text: "Hire by the day, or post a casting call for open roles.",
        }}
      />
      <Suspense
        fallback={
          <ResultsSection
            title="People for the production"
            summary="Loading talent…"
          >
            <GridSkeleton />
          </ResultsSection>
        }
      >
        <TalentResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function TalentResults({
  searchParams,
}: Pick<PageProps<"/cast">, "searchParams">) {
  const [sp, area] = await Promise.all([searchParams, getArea()]);
  const q = param(sp, "q");
  const category = param(sp, "category");
  const showMap = param(sp, "map") === "1";
  const base = { q, category, map: showMap ? "1" : undefined };

  const { talent } = await getCastBoard({ area, q, category });
  const { pageItems, page, pages } = paginate(talent, pageParam(sp));
  const markers = talent.flatMap((t): MapMarker[] =>
    t.lat !== undefined && t.lng !== undefined
      ? [
          {
            id: t.id,
            title: splitTalentTitle(t.title).name,
            subtitle: roleLabel(t.category),
            lat: t.lat,
            lng: t.lng,
            kind: "bookable",
            href: `/cast/talent/${t.id}`,
          },
        ]
      : [],
  );

  return (
    <ResultsSection
      title="People for the production"
      summary={`${talent.length} creative${talent.length === 1 ? "" : "s"} in ${areaLabel(area)}. Browse profiles without signing in.`}
      controls={
        <>
          <CategorySelect
            action="/cast"
            value={category}
            options={ROLES}
            keep={{ q, map: base.map }}
          />
          <MapToggle
            on={showMap}
            href={withParams("/cast", {
              ...base,
              map: showMap ? undefined : "1",
            })}
          />
        </>
      }
      tabs={
        <UnderlineTabs
          label="Talent or casting calls"
          activeKey="talent"
          tabs={[
            { key: "talent", label: "Talent", href: withParams("/cast", base) },
            { key: "calls", label: "Casting calls", href: "/cast/calls" },
          ]}
        />
      }
    >
      {showMap && markers.length > 0 && (
        <ResultsMap center={areaCenter(area)} markers={markers} />
      )}
      {talent.length === 0 ? (
        <EmptyState
          title="No talent matches yet"
          description="Try another role or widen the production area. You can also post a casting call."
          action={
            <ButtonLink href="/cast/calls/new" variant="outline">
              Post a casting call
            </ButtonLink>
          }
        />
      ) : (
        <CardGrid>
          {pageItems.map((t) => {
            const { name, headline } = splitTalentTitle(t.title);
            const href = `/cast/talent/${t.id}`;
            return (
              <CatalogCard
                key={t.id}
                id={t.id}
                href={href}
                photoUrl={t.photoUrl}
                badge={{ label: roleLabel(t.category), variant: "bookable" }}
                kicker={[headline ?? t.category, t.neighborhood]
                  .filter(Boolean)
                  .join(" / ")}
                title={name}
                description={t.description}
                price={
                  t.dayRateNgn
                    ? { amountNgn: t.dayRateNgn, unit: "/ day" }
                    : undefined
                }
                actions={
                  <CardLinks
                    href={href}
                    secondary={{
                      label: "Request to hire",
                      href: `${href}?request=1`,
                    }}
                  />
                }
              />
            );
          })}
        </CardGrid>
      )}
      <Pagination
        page={page}
        pages={pages}
        href={(p) =>
          withParams("/cast", { ...base, page: p > 1 ? p : undefined })
        }
      />
    </ResultsSection>
  );
}

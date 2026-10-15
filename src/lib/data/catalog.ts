/**
 * Catalog data (locations, gear, cast) on top of the generated SDK.
 * Everything returns normalized view models (./types). Signed-in areas live
 * in their own modules (./bookings, ./people, …).
 */
import { orNull, unwrap } from "@/lib/api/client";
import {
  getV1CastCalls,
  getV1CastTalentById,
  getV1CatalogHome,
  getV1Gear,
  getV1GearSale,
  getV1ListingsById,
  getV1Locations,
  type ListingCard,
} from "@/lib/api/generated";
import { client } from "@/lib/api/generated/client.gen";
import { areaQuery, type Area } from "@/lib/area/area";

import { toCall, toItem, toPerson, toPin } from "./normalize";
import type { CastingCall, CatalogItem, ItemDetail, ScoutPin } from "./types";

type SearchQuery = { area: Area; q?: string; category?: string };

function query({ area, q, category }: SearchQuery) {
  return { ...areaQuery(area), q, category };
}

const isPin = (p: ScoutPin | null): p is ScoutPin => p !== null;

// ------------------------------------------------------------- catalog

export async function searchLocations(
  q: SearchQuery,
): Promise<{ items: CatalogItem[]; pins: ScoutPin[] }> {
  const data = await unwrap(getV1Locations({ query: query(q) }));
  return {
    items: (data.listings ?? []).map(toItem),
    pins: (data.pins ?? []).map(toPin).filter(isPin),
  };
}

export async function searchGear(
  q: SearchQuery & { sale?: boolean },
): Promise<CatalogItem[]> {
  const fetcher = q.sale ? getV1GearSale : getV1Gear;
  const data = await unwrap(fetcher({ query: query(q) }));
  return (data.listings ?? []).map(toItem);
}

export async function getHome() {
  const data = await unwrap(getV1CatalogHome());
  return {
    pinCount: data.pins ?? 0,
    locations: (data.locations ?? []).map(toItem),
    gear: (data.gear ?? []).map(toItem),
    gearSale: (data.gearSale ?? []).map(toItem),
    talent: (data.talent ?? []).map(toItem),
  };
}

export async function getItem(id: string): Promise<ItemDetail | null> {
  const data = await orNull(unwrap(getV1ListingsById({ path: { id } })));
  if (!data?.listing) return null;
  const { owner, ...card } = data.listing;
  return { ...toItem(card), owner: owner ? toPerson(owner) : undefined };
}

// ------------------------------------------------------------- cast

export async function getCastBoard(
  q: SearchQuery,
): Promise<{ talent: CatalogItem[]; calls: CastingCall[] }> {
  // Spec gap: /v1/cast declares no query params (the API accepts the area ones),
  // so the generated validator would reject them. Call the client directly.
  const data = await unwrap(
    client.get<{
      200: { talent?: ListingCard[]; calls?: Parameters<typeof toCall>[0][] };
    }>({
      url: "/v1/cast",
      query: query(q),
    }),
  );
  return {
    talent: (data.talent ?? []).map(toItem),
    calls: (data.calls ?? []).map(toCall),
  };
}

export async function getTalent(id: string): Promise<ItemDetail | null> {
  const data = await orNull(unwrap(getV1CastTalentById({ path: { id } })));
  if (!data?.listing) return null;
  const { owner, ...card } = data.listing;
  return { ...toItem(card), owner: owner ? toPerson(owner) : undefined };
}

export async function listCastingCalls(): Promise<CastingCall[]> {
  const data = await unwrap(getV1CastCalls());
  return (data.calls ?? []).map(toCall);
}

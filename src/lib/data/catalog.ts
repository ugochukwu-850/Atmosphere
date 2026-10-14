/**
 * Data access for pages. Uses mock data until the backend is live
 * (API_MOCK=0 switches to the generated SDK).
 */
import { unwrap } from "@/lib/api/client";
import {
  getBooking as sdkGetBooking,
  getCastingCall as sdkGetCastingCall,
  getListing as sdkGetListing,
  getPublicProfile as sdkGetPublicProfile,
  getTalent as sdkGetTalent,
  listBookings as sdkListBookings,
  listCastingCalls as sdkListCastingCalls,
  listListings as sdkListListings,
  listScoutPins as sdkListScoutPins,
  listTalent as sdkListTalent,
  type Booking,
  type CastingCall,
  type Listing,
  type ListingKind,
  type Place,
  type PublicProfile,
  type ScoutPin,
  type Talent,
  type TalentRole,
} from "@/lib/api/generated";
import { areaOrigin, distanceKm, type Area } from "@/lib/area/area";

import { BOOKINGS, CASTING_CALLS, LISTINGS, SCOUT_PINS, TALENT } from "./mock";

const USE_MOCK = process.env.API_MOCK !== "0";

export const PAGE_SIZE = 12;

export type Page<T> = { items: T[]; page: number; pageSize: number; total: number };

type AreaQuery = { area: Area };

/** Query params the API uses for the production area. */
function areaParams(area: Area) {
  const origin = areaOrigin(area);
  return { state: area.state, city: area.city, lat: origin?.lat, lng: origin?.lng };
}

// ------------------------------------------------------------- mock helpers

function inArea(place: Pick<Place, "state" | "city">, area: Area) {
  if (area.city) return place.city === area.city;
  if (area.state) return place.state === area.state;
  return true;
}

function withDistance<T extends { place: Place }>(items: T[], area: Area): T[] {
  const origin = areaOrigin(area);
  if (!origin) return items;
  return items
    .map((item) =>
      item.place.lat !== undefined && item.place.lng !== undefined
        ? {
            ...item,
            place: {
              ...item.place,
              distanceKm: Math.round(distanceKm(origin, { lat: item.place.lat, lng: item.place.lng })),
            },
          }
        : item,
    )
    .sort((a, b) => (a.place.distanceKm ?? Infinity) - (b.place.distanceKm ?? Infinity));
}

function paginate<T>(items: T[], page: number): Page<T> {
  const start = (page - 1) * PAGE_SIZE;
  return { items: items.slice(start, start + PAGE_SIZE), page, pageSize: PAGE_SIZE, total: items.length };
}

function matchesText(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(needle));
}

// ------------------------------------------------------------- listings

export type ListingQuery = AreaQuery & {
  kind: ListingKind;
  category?: string;
  q?: string;
  page?: number;
};

export async function searchListings({ kind, category, q, area, page = 1 }: ListingQuery): Promise<Page<Listing>> {
  if (!USE_MOCK) {
    return unwrap(
      sdkListListings({ query: { kind, category, q, page, pageSize: PAGE_SIZE, ...areaParams(area) } }),
    );
  }
  const filtered = LISTINGS.filter(
    (l) =>
      l.kind === kind &&
      (!category || l.category === category) &&
      inArea(l.place, area) &&
      matchesText(q, l.title, l.description, l.place.neighborhood),
  );
  return paginate(withDistance(filtered, area), page);
}

export async function getListing(id: string): Promise<Listing | null> {
  if (!USE_MOCK) return unwrap(sdkGetListing({ path: { listingId: id } })).catch(() => null);
  return LISTINGS.find((l) => l.id === id) ?? null;
}

export async function listScoutPins(area: Area): Promise<ScoutPin[]> {
  if (!USE_MOCK) return unwrap(sdkListScoutPins({ query: { state: area.state, city: area.city } }));
  return SCOUT_PINS.filter((p) => inArea({ state: p.state ?? "", city: p.city ?? "" }, area));
}

// ------------------------------------------------------------- talent

export type TalentQuery = AreaQuery & { role?: TalentRole; q?: string; page?: number };

export async function searchTalent({ role, q, area, page = 1 }: TalentQuery): Promise<Page<Talent>> {
  if (!USE_MOCK) {
    return unwrap(sdkListTalent({ query: { role, q, page, pageSize: PAGE_SIZE, ...areaParams(area) } }));
  }
  const filtered = TALENT.filter(
    (t) =>
      (!role || t.roles.includes(role)) &&
      inArea(t.place, area) &&
      matchesText(q, t.user.name, t.headline, t.bio, ...(t.specialties ?? [])),
  );
  return paginate(withDistance(filtered, area), page);
}

export async function getTalent(id: string): Promise<Talent | null> {
  if (!USE_MOCK) return unwrap(sdkGetTalent({ path: { talentId: id } })).catch(() => null);
  return TALENT.find((t) => t.id === id) ?? null;
}

// ------------------------------------------------------------- casting

export async function listCastingCalls({
  area,
  role,
}: AreaQuery & { role?: TalentRole }): Promise<Page<CastingCall>> {
  if (!USE_MOCK) {
    return unwrap(sdkListCastingCalls({ query: { role, state: area.state, city: area.city } }));
  }
  const filtered = CASTING_CALLS.filter((c) => (!role || c.roleNeeded === role) && inArea(c.place, area));
  return paginate(filtered, 1);
}

export async function getCastingCall(id: string): Promise<CastingCall | null> {
  if (!USE_MOCK) return unwrap(sdkGetCastingCall({ path: { callId: id } })).catch(() => null);
  return CASTING_CALLS.find((c) => c.id === id) ?? null;
}

// ------------------------------------------------------------- bookings

export async function listBookings(token: string): Promise<Page<Booking>> {
  if (!USE_MOCK) return unwrap(sdkListBookings({ auth: token }));
  return paginate(BOOKINGS, 1);
}

export async function getBooking(token: string, id: string): Promise<Booking | null> {
  if (!USE_MOCK) return unwrap(sdkGetBooking({ auth: token, path: { bookingId: id } })).catch(() => null);
  return BOOKINGS.find((b) => b.id === id) ?? null;
}

// ------------------------------------------------------------- people

export async function getPublicProfile(id: string): Promise<PublicProfile | null> {
  if (!USE_MOCK) return unwrap(sdkGetPublicProfile({ path: { userId: id } })).catch(() => null);
  const talent = TALENT.find((t) => t.user.id === id);
  const listings = LISTINGS.filter((l) => l.owner.id === id);
  const user = talent?.user ?? listings[0]?.owner;
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    roles: [...(talent ? (["creator"] as const) : []), ...(listings.length ? (["owner"] as const) : [])],
    neighborhood: talent?.place.neighborhood,
    bio: talent?.bio,
    specialties: talent?.specialties,
    socials: talent?.socials,
    talent,
    listings,
  };
}

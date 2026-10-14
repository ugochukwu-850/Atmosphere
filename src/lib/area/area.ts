import { z } from "zod";

import { CITIES, NIGERIA_CENTER, type City } from "./cities";

/** Production area: a state, optionally narrowed to one city. Empty = all of Nigeria. */
export const areaSchema = z.object({
  state: z.string().optional(),
  city: z.string().optional(),
});
export type Area = z.infer<typeof areaSchema>;

export const AREA_COOKIE = "ams_area";

export function parseArea(raw: string | undefined): Area {
  if (!raw) return {};
  try {
    const result = areaSchema.safeParse(JSON.parse(decodeURIComponent(raw)));
    return result.success ? result.data : {};
  } catch {
    return {};
  }
}

export function serializeArea(area: Area): string {
  return encodeURIComponent(JSON.stringify(area));
}

export function findCity(slug: string | undefined): City | undefined {
  return slug ? CITIES.find((c) => c.slug === slug) : undefined;
}

/** Point distances are measured from: the city, else the first city of the state. */
export function areaOrigin(area: Area): { lat: number; lng: number } | undefined {
  const city = findCity(area.city);
  if (city) return city;
  return area.state ? CITIES.find((c) => c.state === area.state) : undefined;
}

export function areaCenter(area: Area) {
  return areaOrigin(area) ?? NIGERIA_CENTER;
}

export function areaLabel(area: Area): string {
  const city = findCity(area.city);
  if (city) return `${city.name}, ${city.state}`;
  return area.state ?? "All of Nigeria";
}

/** Great-circle distance in km (haversine). */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** Spatial context the API expects on catalog searches. */
export function areaQuery(area: Area) {
  const city = findCity(area.city);
  if (city) {
    return {
      scope: "metro" as const,
      state: city.state,
      city: city.name,
      lat: city.lat,
      lng: city.lng,
      radiusKm: city.radiusKm,
    };
  }
  if (area.state) return { scope: "state" as const, state: area.state };
  return { scope: "country" as const };
}

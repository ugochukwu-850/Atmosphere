import type { Place } from "@/lib/api/generated";
import { findCity } from "@/lib/area/area";

/** "Yaba, Lagos · 4 km" */
export function placeLabel(place: Place): string {
  const city = findCity(place.city)?.name ?? place.city;
  const base = `${place.neighborhood}, ${city}`;
  return place.distanceKm !== undefined ? `${base} · ${place.distanceKm} km` : base;
}

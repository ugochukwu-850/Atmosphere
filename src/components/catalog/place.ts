/** "Yaba, Lagos · 4 km" */
export function placeLabel(place: {
  neighborhood: string;
  city?: string;
  distanceKm?: number;
}): string {
  const base = [place.neighborhood, place.city].filter(Boolean).join(", ");
  return place.distanceKm !== undefined
    ? `${base} · ${Math.round(place.distanceKm)} km`
    : base;
}

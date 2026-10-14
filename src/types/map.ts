export type LatLng = { lat: number; lng: number };

/** "bookable" listings draw as squares, "scout" pins (info only) as dots. */
export type MarkerKind = "bookable" | "scout";

export type MapMarker = LatLng & {
  id: string;
  title: string;
  kind: MarkerKind;
  subtitle?: string;
  href?: string;
};

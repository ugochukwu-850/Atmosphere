"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import type { LatLng, MapMarker, MarkerKind } from "@/types/map";

// OSM's public tiles are fine for development; set NEXT_PUBLIC_MAP_TILE_URL to a
// keyed provider (MapTiler, Stadia, CARTO) for production traffic.
const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ??
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ??
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Teardrop pins from the Figma map (rust = bookable, olive = scout-only).
// Inline SVG so there are no image assets; colours come from theme tokens.
function pinIcon(fill: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true" style="filter:drop-shadow(0 2px 3px rgb(0 0 0/.35))"><path d="M14 1C7 1 1.5 6.4 1.5 13.3 1.5 22.6 14 35 14 35s12.5-12.4 12.5-21.7C26.5 6.4 21 1 14 1Z" fill="${fill}" stroke="#fff" stroke-width="2"/><circle cx="14" cy="13.5" r="4.5" fill="#fff"/></svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 35],
    popupAnchor: [0, -30],
  });
}

const ICONS: Record<MarkerKind | "pick", L.DivIcon> = {
  bookable: pinIcon("var(--rust)"),
  scout: pinIcon("var(--olive)"),
  pick: pinIcon("var(--rust)"),
};

export type LeafletMapProps = {
  center: LatLng;
  zoom?: number;
  markers?: MapMarker[];
  /** Fit the view to all markers when there are 2 or more. */
  fitMarkers?: boolean;
  /** Pin-drop mode: clicking the map reports the point. */
  picked?: LatLng | null;
  onPick?: (point: LatLng) => void;
};

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length < 2) return;
    map.fitBounds(L.latLngBounds(markers.map((m) => [m.lat, m.lng])), {
      padding: [32, 32],
      maxZoom: 14,
    });
  }, [map, markers]);
  return null;
}

function Recenter({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [map, center.lat, center.lng, zoom]);
  return null;
}

function PickHandler({ onPick }: { onPick: (point: LatLng) => void }) {
  useMapEvents({
    click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }),
  });
  return null;
}

export default function LeafletMap({
  center,
  zoom = 11,
  markers = [],
  fitMarkers = true,
  picked,
  onPick,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      className="size-full"
    >
      <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
      {fitMarkers && markers.length > 1 ? (
        <FitBounds markers={markers} />
      ) : (
        <Recenter center={center} zoom={zoom} />
      )}
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={ICONS[m.kind]}>
          <Popup>
            <div className="flex flex-col gap-1">
              <strong>{m.title}</strong>
              {m.subtitle && <span>{m.subtitle}</span>}
              {m.href && <Link href={m.href}>View details</Link>}
            </div>
          </Popup>
        </Marker>
      ))}
      {onPick && <PickHandler onPick={onPick} />}
      {picked && (
        <Marker position={[picked.lat, picked.lng]} icon={ICONS.pick} />
      )}
    </MapContainer>
  );
}

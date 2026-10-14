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

// CSS-only markers: no image assets, styled from theme tokens.
const ICONS: Record<MarkerKind | "pick", L.DivIcon> = {
  bookable: L.divIcon({
    className: "",
    html: '<span style="display:block;width:16px;height:16px;border-radius:3px;background:var(--rust);border:2px solid #fff;box-shadow:0 1px 4px rgb(0 0 0/.4)"></span>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  }),
  scout: L.divIcon({
    className: "",
    html: '<span style="display:block;width:12px;height:12px;border-radius:9999px;background:var(--gold);border:2px solid #fff;box-shadow:0 1px 4px rgb(0 0 0/.4)"></span>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  }),
  pick: L.divIcon({
    className: "",
    html: '<span style="display:block;width:20px;height:20px;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);background:var(--rust);border:2px solid #fff"></span>',
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  }),
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

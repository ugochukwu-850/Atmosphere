"use client";

import { useState } from "react";

import { MapView } from "@/components/map/MapView";
import { AreaSelect, decodeArea } from "@/components/search/AreaSelect";
import { Button } from "@/components/ui/button";
import { Field, Input, fieldControl } from "@/components/ui/form";
import { areaCenter, findCity, type Area } from "@/lib/area/area";
import { cn } from "@/lib/utils";
import type { LatLng } from "@/types/map";

const round6 = (n: number) => Math.round(n * 1e6) / 1e6;

function placeName(area: Area) {
  return findCity(area.city)?.name ?? area.state;
}

/**
 * City (AreaSelect) and neighbourhood, plus an optional pin-drop map centred
 * on the chosen city. The pin posts as hidden `lat` / `lng`; empty means "use
 * the city centre".
 */
export function PlaceFields({
  defaultArea,
  defaultNeighborhood,
  neighborhoodPlaceholder,
  errors,
  pin: pinOptions,
}: {
  /** AreaSelect value: "city:<slug>", "state:<State>" or "". */
  defaultArea: string;
  defaultNeighborhood?: string;
  neighborhoodPlaceholder: string;
  errors: { area?: string; neighborhood?: string; pin?: string };
  /** Show the map. `what` finishes "Click the map to pin …". */
  pin?: { what: string; defaultPin: LatLng | null };
}) {
  const [area, setArea] = useState(defaultArea);
  const [pin, setPin] = useState<LatLng | null>(pinOptions?.defaultPin ?? null);
  const decoded = decodeArea(area);
  const place = placeName(decoded);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="City" htmlFor="area" error={errors.area}>
          <AreaSelect
            id="area"
            name="area"
            emptyLabel="Choose a city"
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              // A pin from another city would sit off the recentred map.
              setPin(null);
            }}
            aria-invalid={Boolean(errors.area)}
            required
            selectClassName={cn(fieldControl, "h-11 pr-10")}
            className="[&>svg]:text-muted-foreground"
          />
        </Field>
        <Field
          label="Neighbourhood"
          htmlFor="neighborhood"
          error={errors.neighborhood}
        >
          <Input
            id="neighborhood"
            name="neighborhood"
            defaultValue={defaultNeighborhood}
            placeholder={neighborhoodPlaceholder}
            maxLength={80}
            aria-invalid={Boolean(errors.neighborhood)}
            required
          />
        </Field>
      </div>

      {pinOptions && (
        <div className="flex flex-col gap-2">
          <MapView
            className="h-80 md:h-[420px]"
            center={areaCenter(decoded)}
            zoom={decoded.city ? 12 : decoded.state ? 9 : 6}
            picked={pin}
            onPick={(p) => setPin({ lat: round6(p.lat), lng: round6(p.lng) })}
          />
          <input type="hidden" name="lat" value={pin?.lat ?? ""} />
          <input type="hidden" name="lng" value={pin?.lng ?? ""} />
          <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <p
              aria-live="polite"
              className={cn(
                "text-xs",
                errors.pin ? "text-destructive" : "text-subtle-foreground",
              )}
            >
              {errors.pin ??
                (pin
                  ? `Pinned at ${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}.`
                  : place
                    ? `Click the map to pin ${pinOptions.what}. Without a pin, we use the centre of ${place}.`
                    : `Choose a city, then click the map to pin ${pinOptions.what}.`)}
            </p>
            {pin && (
              <Button variant="ghost" size="sm" onClick={() => setPin(null)}>
                Remove pin
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

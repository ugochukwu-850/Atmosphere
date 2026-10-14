"use client";

import { Select } from "@/components/ui/form";
import { CITIES, STATES } from "@/lib/area/cities";
import { cn } from "@/lib/utils";

import { useArea } from "./AreaProvider";

/** State + city selects. Sets the production area used for distance and sorting. */
export function AreaPicker({ className }: { className?: string }) {
  const { area, setArea } = useArea();
  const cities = area.state
    ? CITIES.filter((c) => c.state === area.state)
    : CITIES;

  return (
    <div className={cn("flex gap-2", className)}>
      <Select
        aria-label="State"
        value={area.state ?? ""}
        onChange={(e) => setArea({ state: e.target.value || undefined })}
        className="h-9 w-auto min-w-36"
      >
        <option value="">All of Nigeria</option>
        {STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
      <Select
        aria-label="City"
        value={area.city ?? ""}
        onChange={(e) => {
          const city = CITIES.find((c) => c.slug === e.target.value);
          setArea(
            city
              ? { state: city.state, city: city.slug }
              : { state: area.state },
          );
        }}
        className="h-9 w-auto min-w-32"
      >
        <option value="">Any city</option>
        {cities.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </Select>
    </div>
  );
}

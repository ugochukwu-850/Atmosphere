"use client";

import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";

import { type Area } from "@/lib/area/area";
import { CITIES, STATES } from "@/lib/area/cities";
import { cn } from "@/lib/utils";

/** One select for the production area: "" | "state:<State>" | "city:<slug>". */
export function encodeArea(area: Area): string {
  if (area.city) return `city:${area.city}`;
  if (area.state) return `state:${area.state}`;
  return "";
}

export function decodeArea(value: string): Area {
  if (value.startsWith("city:")) {
    const city = CITIES.find((c) => c.slug === value.slice(5));
    return city ? { state: city.state, city: city.slug } : {};
  }
  if (value.startsWith("state:")) return { state: value.slice(6) };
  return {};
}

export function AreaSelect({
  className,
  selectClassName,
  ...props
}: Omit<ComponentProps<"select">, "children"> & { selectClassName?: string }) {
  return (
    <div className={cn("relative", className)}>
      <select
        className={cn("w-full appearance-none pr-10", selectClassName)}
        {...props}
      >
        <option value="">Anywhere in Nigeria</option>
        {STATES.map((state) => (
          <optgroup key={state} label={state}>
            <option value={`state:${state}`}>All of {state}</option>
            {CITIES.filter((c) => c.state === state).map((city) => (
              <option key={city.slug} value={`city:${city.slug}`}>
                {city.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-charcoal-600"
      />
    </div>
  );
}

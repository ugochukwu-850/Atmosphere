import { z } from "zod";

import { CITIES } from "@/lib/area/cities";

/** Option in a select with suggestions (the API takes free text). */
export type Choice = { value: string; label: string };

/** Select value for "Other…": the text box next to it holds the real value. */
export const OTHER_CHOICE = "__other";

/** Value of a select-plus-"Other" field, posted as `<name>Choice` and `<name>Other`. */
export function chosen(formData: FormData, name: string): string {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const choice = get(`${name}Choice`);
  return choice === OTHER_CHOICE ? get(`${name}Other`) : choice;
}

/** Empty form strings mean "not given" for optional fields. */
export const blankToUndefined = (value: unknown) =>
  value === "" ? undefined : value;

/**
 * AreaSelect's value ("city:<slug>" | "state:<State>") as the place the API
 * expects, plus the coordinates to fall back on when no pin was dropped: the
 * city centre, or the state's first city.
 */
export function areaField(message: string) {
  return z.string().transform((value, ctx) => {
    const city = value.startsWith("city:")
      ? CITIES.find((c) => c.slug === value.slice(5))
      : undefined;
    if (city) {
      return {
        city: city.name,
        state: city.state,
        lat: city.lat,
        lng: city.lng,
      };
    }
    const state = value.startsWith("state:") ? value.slice(6) : "";
    const first = CITIES.find((c) => c.state === state);
    if (first) {
      return { city: undefined, state, lat: first.lat, lng: first.lng };
    }
    ctx.addIssue({ code: "custom", message });
    return z.NEVER;
  });
}

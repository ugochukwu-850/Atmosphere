/** What people can search for, in the order of the Figma hero search tabs. */
export const SEARCH_TARGETS = [
  {
    key: "location",
    label: "Location",
    path: "/locations",
    placeholder: "Studio, rooftop, warehouse…",
  },
  {
    key: "cast",
    label: "Cast & Talent",
    path: "/cast",
    placeholder: "Actor, DP, sound, makeup…",
  },
  {
    key: "rent",
    label: "Rent Gear",
    path: "/gear",
    placeholder: "Cinema camera, lights, audio…",
  },
  {
    key: "buy",
    label: "Buy Gear",
    path: "/gear/sale",
    placeholder: "Used camera, lenses…",
  },
] as const;

export type SearchTarget = (typeof SEARCH_TARGETS)[number];
export type SearchTargetKey = SearchTarget["key"];

export function targetFor(key: string): SearchTarget {
  return SEARCH_TARGETS.find((t) => t.key === key) ?? SEARCH_TARGETS[0];
}

/** Which search the current page belongs to, for prefilling the header pill. */
export function targetForPath(pathname: string): SearchTarget {
  return (
    [...SEARCH_TARGETS]
      .sort((a, b) => b.path.length - a.path.length)
      .find((t) => pathname === t.path || pathname.startsWith(`${t.path}/`)) ??
    SEARCH_TARGETS[0]
  );
}

export function searchHref(
  target: SearchTarget,
  q?: string,
  date?: string,
): string {
  const params = new URLSearchParams();
  if (q?.trim()) params.set("q", q.trim());
  if (date) params.set("date", date);
  const qs = params.toString();
  return qs ? `${target.path}?${qs}` : target.path;
}

/** Inner-page nav (Figma: Location Search / Location Detail header). */
export const SITE_NAV = [
  { href: "/locations", label: "Location", match: ["/locations", "/listings"] },
  { href: "/gear", label: "Gear", match: ["/gear"] },
  { href: "/cast", label: "Talent and Cast", match: ["/cast"] },
  { href: "/planner", label: "Planner", match: ["/planner"] },
] as const;

/** Nav inside the landing hero. */
export const LANDING_NAV = [
  { href: "/#offer", label: "What We Offer" },
  { href: "/#how", label: "How it works" },
  { href: "/#about", label: "About Us" },
  { href: "/planner", label: "Planner" },
] as const;

/** Pages that open with the charcoal search band, so the header joins it. */
export const DARK_HEADER_PATHS = [
  "/locations",
  "/gear",
  "/gear/sale",
  "/cast",
  "/cast/calls",
];

export function isNavActive(
  pathname: string,
  match: readonly string[],
): boolean {
  return match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}

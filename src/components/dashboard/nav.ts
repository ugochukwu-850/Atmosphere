/** Sidebar of the signed-in dashboard (Figma: Dashboard frames). */
export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", match: [] },
  { href: "/saved", label: "Saved item", icon: "saved", match: [] },
  { href: "/bookings", label: "Booking", icon: "booking", match: [] },
  {
    href: "/notifications",
    label: "Notification",
    icon: "notification",
    match: [],
  },
  { href: "/planner", label: "Planner", icon: "planner", match: [] },
  {
    href: "/account",
    label: "Settings",
    icon: "settings",
    // Listing and casting forms are account tools without their own entry.
    match: ["/list", "/cast/calls/new"],
  },
] as const;

export type DashboardIcon = (typeof DASHBOARD_NAV)[number]["icon"] | "bell";

export function isDashboardActive(
  pathname: string,
  item: { href: string; match: readonly string[] },
): boolean {
  return [item.href, ...item.match].some(
    (m) => pathname === m || pathname.startsWith(`${m}/`),
  );
}

export const NAV_ITEMS = [
  { href: "/locations", label: "Locations" },
  { href: "/gear", label: "Rent gear" },
  { href: "/gear/sale", label: "Buy gear" },
  { href: "/cast", label: "Cast" },
  { href: "/planner", label: "Planner" },
] as const;

/** Longest matching nav item wins, so "/gear/sale" doesn't also light up "/gear". */
export function isActive(pathname: string, href: string): boolean {
  const best = NAV_ITEMS.filter(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  ).sort((a, b) => b.href.length - a.href.length)[0];
  return best?.href === href;
}

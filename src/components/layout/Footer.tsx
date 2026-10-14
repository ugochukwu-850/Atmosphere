import Link from "next/link";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/locations", label: "Locations" },
      { href: "/gear", label: "Rent gear" },
      { href: "/gear/sale", label: "Buy gear" },
      { href: "/cast", label: "Cast" },
    ],
  },
  {
    title: "Create",
    links: [
      { href: "/planner", label: "Production planner" },
      { href: "/cast/calls", label: "Casting calls" },
      { href: "/list", label: "Become a provider" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy (NDPR)" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-16 sm:px-6 md:grid-cols-[2fr_repeat(3,1fr)] lg:px-10">
        <div className="flex max-w-sm flex-col gap-3">
          <p className="font-heading text-lg font-bold">ArtMostSphere</p>
          <p className="text-sm text-ink-muted">
            Africa&apos;s production OS, starting in Nigeria. Locations, kit and crew in one
            catalog. We are not an insurer.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-[0.18em] text-ink-muted uppercase">
              {col.title}
            </p>
            {col.links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm hover:text-gold">
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      {/* Oversized wordmark from the Figma footer. */}
      <p
        aria-hidden
        className="mt-12 -mb-[0.18em] text-center font-heading text-[clamp(3rem,13vw,12rem)] leading-none font-extrabold tracking-tight select-none"
      >
        ArtMostSphere
      </p>
    </footer>
  );
}

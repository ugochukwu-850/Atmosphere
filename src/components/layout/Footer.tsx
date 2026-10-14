import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Container } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

// Static so the footer stays prerenderable (new Date() would make it dynamic).
const COPYRIGHT_YEAR = 2026;

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/locations", label: "Location" },
      { href: "/gear", label: "Rent a gear" },
      { href: "/gear/sale", label: "Buy used gear" },
      { href: "/cast", label: "Cast & Talent" },
      { href: "/planner", label: "Planner" },
    ],
  },
  {
    title: "For Providers",
    links: [
      { href: "/list", label: "List a Location" },
      { href: "/list", label: "List a gear" },
      { href: "/register", label: "Join as Talent" },
      { href: "/bookings", label: "Provider workspace" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#about", label: "About ArtMostSphere" },
      { href: "/#offer", label: "What we offer" },
      { href: "/#how", label: "How it works" },
      { href: "/#faq", label: "FAQs" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms and Condition" },
      { href: "/privacy", label: "Privacy and Policy" },
    ],
  },
] as const;

// Brand glyphs (lucide no longer ships brand icons).
const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15Z" />
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: <path d="M4 4l16 16M20 4 4 20" />,
  },
];

/** Tilted tags sitting on the giant wordmark (Figma footer). */
const TAGS = [
  {
    label: "Location",
    className: "left-[6%] top-[4%] -rotate-6 bg-primary text-white",
  },
  {
    label: "Gear",
    className: "left-[40%] top-[24%] rotate-2 bg-olive text-white",
  },
  {
    label: "Talent & Cast",
    className: "right-[2%] top-[12%] rotate-6 bg-sand text-charcoal",
  },
] as const;

export function Footer() {
  return (
    <footer className="overflow-hidden rounded-t-[clamp(2rem,4.2vw,4rem)] bg-ink text-white">
      <Container className="pt-16 md:pt-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="flex max-w-xs flex-col gap-5">
            <Link href="/" className="flex items-center gap-3">
              <span aria-hidden className="size-10 bg-primary" />
              <span className="font-heading text-xl font-semibold">
                Artmostsphere
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-charcoal-700">
              The production ecosystem for Africa.
              <br />
              Built for the people who make things.
            </p>
            <ul className="flex gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid size-7 place-items-center rounded-xs bg-ivory text-charcoal hover:bg-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {s.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 lg:w-[58%] lg:shrink-0"
          >
            {COLUMNS.map((col, i) => (
              <div
                key={col.title}
                className={cn(
                  "flex flex-col gap-6 sm:min-h-44 sm:pr-6",
                  i > 0 && "sm:border-l sm:border-white/25 sm:pl-8",
                )}
              >
                <p className="text-[15px] font-semibold uppercase">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-charcoal-700 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-24 flex flex-col gap-4 border-t border-white/25 pt-5 text-base text-charcoal-700 md:flex-row md:items-center md:justify-between">
          <p>© {COPYRIGHT_YEAR} ArtMostSphere. All rights reserved.</p>
          <ThemeToggle className="text-white" />
          <p>Starting in Nigeria. Building for Africa</p>
        </div>
      </Container>

      {/* Oversized wordmark with tilted category tags. */}
      <div aria-hidden className="relative mt-10 select-none">
        <p className="-mb-[0.12em] text-center font-heading text-[13.05vw] leading-[0.95] font-bold tracking-tight whitespace-nowrap text-ivory 2xl:text-[197px]">
          ArtMostSphere
        </p>
        {TAGS.map((tag) => (
          <span
            key={tag.label}
            className={cn(
              "absolute rounded-[0.45em] px-[1.9em] py-[0.55em] font-heading text-[2.1vw] font-medium whitespace-nowrap 2xl:text-[32px]",
              tag.className,
            )}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </footer>
  );
}

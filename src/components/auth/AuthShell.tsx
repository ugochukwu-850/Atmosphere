import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { LANDING_MEDIA } from "@/components/landing/media";
import { Wordmark } from "@/components/layout/Wordmark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

// Same tilted category tags as the footer wordmark.
const TAGS = [
  { label: "Location", className: "-rotate-6 bg-primary text-white" },
  { label: "Gear", className: "rotate-2 bg-olive text-white" },
  { label: "Talent & Cast", className: "rotate-6 bg-sand text-charcoal" },
] as const;

/**
 * Split-screen frame for sign in (sign-up has its own Figma frames, see
 * components/onboarding). Not in the Figma file: built from
 * its hero photo card, sign-in modal and footer tag patterns.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="hidden p-2 lg:block">
        <div className="sticky top-2 isolate flex h-[calc(100vh-1rem)] flex-col justify-between overflow-hidden rounded-2xl bg-ink p-12 text-white">
          <div className="absolute inset-0 -z-10">
            <Image
              src={LANDING_MEDIA.hero}
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/30 to-black/85" />

          <Link href="/" className="font-heading text-xl font-semibold">
            Artmostsphere
          </Link>

          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-semibold tracking-[0.4em] text-white/85 uppercase">
              The production ecosystem for Africa
            </p>
            <p className="max-w-[34rem] font-heading text-5xl leading-[0.9] font-semibold tracking-tight xl:text-[64px]">
              Find what your next{" "}
              <span className="text-sand">shoot needs.</span>
            </p>
            <p className="max-w-[28rem] text-base text-white/85">
              Locations. Gear. Cast. Planning. All in one production space.
            </p>
            <ul
              aria-label="What you can find"
              className="mt-4 flex flex-wrap gap-3"
            >
              {TAGS.map((tag) => (
                <li
                  key={tag.label}
                  className={cn(
                    "rounded-md px-6 py-2.5 font-heading text-lg font-medium",
                    tag.className,
                  )}
                >
                  {tag.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <div className="flex flex-col px-5 py-6 md:px-10">
        <div className="flex items-center justify-between gap-4">
          <Wordmark className="lg:invisible" />
          <ThemeToggle />
        </div>
        <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-12">
          {children}
        </main>
        <p className="text-center text-xs text-subtle-foreground">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

/** Eyebrow + title + intro, in the style of the "Sign in to request" modal. */
export function AuthHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-primary uppercase">{eyebrow}</p>
      <h1 className="font-sans text-3xl leading-tight font-bold md:text-4xl">
        {title}
      </h1>
      <p className="text-base text-muted-foreground">{description}</p>
    </div>
  );
}

/** Rust-on-error alert used under the form fields. */
export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="border-l-4 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive"
    >
      {children}
    </p>
  );
}

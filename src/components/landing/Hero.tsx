import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { LANDING_NAV } from "@/components/layout/nav";
import { UserMenu } from "@/components/layout/UserMenu";
import { HeroSearchCard } from "@/components/search/SearchForms";
import { ButtonLink } from "@/components/ui/button";

import { LANDING_MEDIA } from "./media";

/** Nav that sits inside the hero photo card (Figma: Landing Page / Frame 1). */
function LandingNav() {
  return (
    <div className="relative z-20 flex items-center gap-8 px-6 pt-6 text-white md:px-10 md:pt-8 lg:pr-[77px] lg:pl-[53px]">
      <Link href="/" className="font-heading text-xl font-semibold">
        Artmostsphere
      </Link>
      <nav
        aria-label="Main"
        className="mx-auto hidden items-center gap-5 lg:flex"
      >
        {LANDING_NAV.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              i === 0
                ? "text-[15px] text-white"
                : "text-[15px] text-white/75 hover:text-white"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3 lg:ml-0">
        <ButtonLink
          href="/list"
          variant="glass"
          size="lg"
          className="hidden h-13 px-7 sm:inline-flex"
        >
          Become a provider
        </ButtonLink>
        <Suspense
          fallback={<div className="h-13 w-[121px] rounded-sm bg-primary" />}
        >
          <UserMenu signInClassName="h-13 w-[121px]" />
        </Suspense>
        <MobileMenu items={LANDING_NAV} className="lg:hidden" />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="p-2">
      <div className="relative isolate flex flex-col overflow-hidden rounded-2xl bg-ink lg:min-h-[1010px]">
        <Image
          src={LANDING_MEDIA.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/35 to-black/80" />

        <LandingNav />

        <div className="flex flex-1 flex-col items-center px-6 pt-24 pb-10 text-center text-white md:pt-[200px] lg:pb-72">
          <p className="text-[10px] font-semibold tracking-[0.4em] text-white/85 uppercase">
            The production ecosystem for Africa
          </p>
          <h1 className="mt-2 text-5xl leading-[0.85] font-semibold tracking-tight md:text-[80px]">
            Find what your
            <br />
            next <span className="text-sand">shoot needs.</span>
          </h1>
          <p className="mt-5 max-w-[37rem] text-base text-white/90">
            Locations. Gear. Cast. Planning. All in one production space. Move
            from a first idea to the people and resources that bring it to life.
          </p>
          <ButtonLink
            href="/locations"
            size="lg"
            className="mt-7 h-[50px] w-[260px]"
          >
            Explore Artmostsphere
          </ButtonLink>
        </div>

        {/* Search card overlaps the bottom of the photo on desktop, stacks below on mobile. */}
        <div className="px-3 pb-3 lg:absolute lg:inset-x-[22px] lg:bottom-[25px] lg:px-0 lg:pb-0">
          <HeroSearchCard />
        </div>
      </div>
    </section>
  );
}

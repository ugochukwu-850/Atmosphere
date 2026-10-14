import Link from "next/link";
import { Suspense } from "react";

import { AreaPicker } from "@/components/area/AreaPicker";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ButtonLink } from "@/components/ui/button";

import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-ink-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Link href="/" aria-label="ArtMostSphere home">
          <Logo />
        </Link>
        {/* usePathname suspends on routes with request-time params. */}
        <Suspense fallback={<div className="hidden flex-1 lg:block" />}>
          <NavLinks className="hidden lg:flex" />
        </Suspense>
        <div className="ml-auto flex items-center gap-3">
          <AreaPicker className="hidden xl:flex [&_select]:border-white/15 [&_select]:bg-white/5" />
          <ThemeToggle className="hidden md:inline-flex" />
          <ButtonLink href="/list" size="sm" className="hidden sm:inline-flex">
            List something
          </ButtonLink>
          {/* Session lookup reads cookies, so it streams in behind a boundary. */}
          <Suspense
            fallback={<div className="size-9 rounded-full bg-white/10" />}
          >
            <UserMenu />
          </Suspense>
          <Suspense fallback={<div className="size-9 lg:hidden" />}>
            <MobileNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

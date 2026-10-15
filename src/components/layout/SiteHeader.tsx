import { Suspense } from "react";

import { CompactSearch } from "@/components/search/SearchForms";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Container } from "@/components/ui/typography";

import { HeaderFrame, HeaderShell } from "./HeaderShell";
import { MobileMenu } from "./MobileMenu";
import { SITE_NAV } from "./nav";
import { SiteNav } from "./SiteNav";
import { UserMenu } from "./UserMenu";
import { Wordmark } from "./Wordmark";

/**
 * Header for every page except the landing page (which has its nav inside
 * the hero). Tone follows the page: charcoal on search pages, white elsewhere.
 */
export function SiteHeader() {
  return (
    // HeaderShell reads the pathname, which suspends on routes with request-time
    // params; the fallback is a plain header with the wordmark.
    <Suspense
      fallback={
        <HeaderFrame tone="light">
          <Container className="flex h-20 items-center">
            <Wordmark />
          </Container>
        </HeaderFrame>
      }
    >
      <HeaderShell>
        <Container className="flex h-20 items-center gap-10">
          <Wordmark />
          <SiteNav className="hidden lg:flex" />
          <div className="ml-auto flex items-center gap-4">
            <CompactSearch className="hidden xl:block" />
            <ThemeToggle className="hidden md:inline-flex" />
            <Suspense
              fallback={<div className="size-10 rounded-full bg-[#d9d9d9]" />}
            >
              <UserMenu />
            </Suspense>
            <MobileMenu items={SITE_NAV} className="lg:hidden" />
          </div>
        </Container>
      </HeaderShell>
    </Suspense>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";

import { CastingCallCard } from "@/components/catalog/CastingCallCard";
import { CardGrid } from "@/components/catalog/CatalogCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { GridSkeleton } from "@/components/catalog/GridSkeleton";
import { ResultsSection } from "@/components/catalog/Results";
import { SearchBand } from "@/components/catalog/SearchBand";
import { UnderlineTabs } from "@/components/catalog/UnderlineTabs";
import { ButtonLink } from "@/components/ui/button";
import { getSessionToken } from "@/lib/auth/session";
import { listCastingCalls } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Casting calls" };

export default function CastingCallsPage() {
  return (
    <>
      <SearchBand
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/cast", label: "Talent and Cast" },
          { label: "Casting calls" },
        ]}
        title={
          <>
            Open <span className="text-sand">roles</span> for
            <br />
            the next shoot.
          </>
        }
        intro="Productions looking for cast and crew right now. Read the brief, then tell the poster why you fit."
        note={{
          title: "Casting for a production?",
          text: "Post a call and let the right people come to you.",
        }}
      />
      <Suspense
        fallback={
          <ResultsSection title="Open casting calls" summary="Loading calls…">
            <GridSkeleton />
          </ResultsSection>
        }
      >
        <CallResults />
      </Suspense>
    </>
  );
}

async function CallResults() {
  const [calls, token] = await Promise.all([
    listCastingCalls(),
    getSessionToken(),
  ]);
  const open = calls.filter((c) => c.status === "open");

  return (
    <ResultsSection
      title="Open casting calls"
      summary={`${open.length} open call${open.length === 1 ? "" : "s"}. Read every brief without signing in.`}
      controls={
        <ButtonLink
          href="/cast/calls/new"
          className="h-10 rounded-xs px-5 text-[13px]"
        >
          Post a call
        </ButtonLink>
      }
      tabs={
        <UnderlineTabs
          label="Talent or casting calls"
          activeKey="calls"
          tabs={[
            { key: "talent", label: "Talent", href: "/cast" },
            { key: "calls", label: "Casting calls", href: "/cast/calls" },
          ]}
        />
      }
    >
      {open.length === 0 ? (
        <EmptyState
          title="No open calls right now"
          description="Check back soon, or post a call for your own production."
        />
      ) : (
        <CardGrid>
          {open.map((call) => (
            <CastingCallCard
              key={call.id}
              call={call}
              signedIn={Boolean(token)}
            />
          ))}
        </CardGrid>
      )}
    </ResultsSection>
  );
}

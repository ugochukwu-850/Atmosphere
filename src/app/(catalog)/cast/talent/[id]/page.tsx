import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { WIDE } from "@/components/catalog/SearchBand";
import { roleLabel, splitTalentTitle } from "@/components/catalog/talent";
import { DetailHeader } from "@/components/detail/DetailHeader";
import { Gallery } from "@/components/detail/Gallery";
import { PricePanel, RequestButton } from "@/components/detail/PriceCard";
import {
  BulletList,
  Callout,
  FactsRow,
  ListedBy,
  SectionTitle,
} from "@/components/detail/Sections";
import { ButtonLink } from "@/components/ui/button";
import { getSessionToken } from "@/lib/auth/session";
import { getTalent } from "@/lib/data/catalog";
import { formatNgn } from "@/lib/format";
import { param } from "@/lib/search-params";

export async function generateMetadata({
  params,
}: PageProps<"/cast/talent/[id]">): Promise<Metadata> {
  const talent = await getTalent((await params).id);
  return talent
    ? {
        title: splitTalentTitle(talent.title).name,
        description: talent.description,
      }
    : {};
}

// `params` is request-time data under cacheComponents, so it is read inside Suspense.
export default function TalentPage({
  params,
  searchParams,
}: PageProps<"/cast/talent/[id]">) {
  return (
    <Suspense fallback={<div className={`${WIDE} h-[70vh]`} />}>
      <TalentContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

/** Talent profile on the Location Detail template. */
async function TalentContent({
  params,
  searchParams,
}: Pick<PageProps<"/cast/talent/[id]">, "params" | "searchParams">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [talent, token] = await Promise.all([getTalent(id), getSessionToken()]);
  if (!talent) notFound();

  const { name, headline } = splitTalentTitle(talent.title);
  const firstName = name.split(" ")[0] ?? name;
  const place = [talent.neighborhood, talent.city].filter(Boolean).join(" ");
  const owner = talent.owner;

  return (
    <article className="pb-24">
      <DetailHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/cast", label: "Talent and Cast" },
          { label: name },
        ]}
        title={name}
        facts={[
          "Available for hire",
          place,
          roleLabel(headline ?? talent.category),
        ]}
      />
      <Gallery photos={talent.photoUrl ? [talent.photoUrl] : []} title={name} />

      <div
        className={`${WIDE} mt-16 grid gap-12 lg:grid-cols-[minmax(0,876fr)_minmax(0,475fr)] lg:gap-[55px]`}
      >
        <div className="flex flex-col gap-8">
          <h2 className="text-4xl font-semibold tracking-tight">
            About {firstName}
          </h2>
          <div className="flex flex-col gap-5">
            {owner && (
              <ListedBy
                label="Profile"
                name={owner.name}
                href={`/people/${owner.id}`}
              />
            )}
            <FactsRow
              items={[
                roleLabel(talent.category),
                `Rate ${formatNgn(talent.dayRateNgn)} / day`,
                ...(owner?.phone ? [owner.phone] : []),
              ]}
            />
          </div>
          {owner?.bio && (
            <p className="text-lg leading-relaxed text-foreground">
              {owner.bio}
            </p>
          )}
          <p className="text-lg leading-relaxed text-muted-foreground">
            {talent.description}
          </p>

          {owner && owner.specialties.length > 0 && (
            <section className="flex flex-col gap-4">
              <SectionTitle>Specialties</SectionTitle>
              <BulletList
                items={owner.specialties.map(
                  (s) => s.charAt(0).toUpperCase() + s.slice(1),
                )}
              />
            </section>
          )}

          <section className="flex flex-col gap-4">
            <SectionTitle>Before you hire</SectionTitle>
            <Callout title="Hire is a dated request">
              The creative confirms availability and payment. This is not a
              licensed agency escrow.
            </Callout>
          </section>

          <section className="flex flex-col gap-3">
            <SectionTitle>Hire information</SectionTitle>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Share your shoot dates and what you need after signing in.{" "}
              {firstName} can confirm availability, call times and any terms.
            </p>
          </section>

          <ButtonLink
            href="/cast"
            variant="outline"
            className="mt-6 h-12 self-start px-5 text-sm font-normal"
          >
            <ChevronLeft className="size-4" />
            Back to all talent
          </ButtonLink>
        </div>

        <aside className="lg:pt-[88px]">
          <PricePanel
            amountNgn={talent.dayRateNgn}
            unit="/per day"
            status={{ label: "Available for hire", tone: "olive" }}
            note={`Review ${firstName}'s profile, then sign in to request a hire for your shoot dates.`}
          >
            <RequestButton
              listingId={talent.id}
              dayRateNgn={talent.dayRateNgn}
              verb="Request to hire"
              noun="hire"
              signedIn={Boolean(token)}
              autoOpen={param(sp, "request") === "1"}
            />
          </PricePanel>
        </aside>
      </div>
    </article>
  );
}

import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { WIDE } from "@/components/catalog/SearchBand";
import { DetailHeader } from "@/components/detail/DetailHeader";
import {
  BulletList,
  FactsRow,
  ListedBy,
  SectionTitle,
} from "@/components/detail/Sections";
import {
  LatestPosts,
  LatestPostsSkeleton,
} from "@/components/profile/LatestPosts";
import { SocialLinks } from "@/components/profile/SocialLinks";
import { buttonClasses, ButtonLink } from "@/components/ui/button";
import { getPerson } from "@/lib/data/people";
import { isSocialPlatform } from "@/lib/validators/account";

export async function generateMetadata({
  params,
}: PageProps<"/people/[id]">): Promise<Metadata> {
  const person = await getPerson((await params).id);
  return person ? { title: person.name, description: person.bio } : {};
}

// `params` is request-time data under cacheComponents, so it is read inside Suspense.
export default function PersonPage({ params }: PageProps<"/people/[id]">) {
  return (
    <Suspense fallback={<div className={`${WIDE} h-[70vh]`} />}>
      <PersonContent params={params} />
    </Suspense>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Public profile on the Location Detail template. */
async function PersonContent({
  params,
}: Pick<PageProps<"/people/[id]">, "params">) {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();

  const firstName = person.name.split(" ")[0] || person.name;
  const specialties = person.specialties.map(capitalize);
  const feed = person.socials.find((s) => s.showFeed)?.platform;
  const count = (n: number, one: string, many: string) =>
    n > 0 ? `${n} ${n === 1 ? one : many}` : undefined;
  // The phone sits in the contact panel, so it isn't repeated here.
  const facts = [
    person.neighborhood,
    count(specialties.length, "specialty", "specialties"),
    count(person.socials.length, "social account", "social accounts"),
  ].filter((fact): fact is string => Boolean(fact));

  return (
    <article className="pb-24">
      <DetailHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/cast", label: "Talent and Cast" },
          { label: person.name },
        ]}
        title={person.name}
        facts={[
          "Creative profile",
          ...(person.neighborhood ? [person.neighborhood] : []),
          ...(specialties[0] ? [specialties[0]] : []),
        ]}
      />

      <div
        className={`${WIDE} mt-16 grid gap-12 lg:grid-cols-[minmax(0,876fr)_minmax(0,475fr)] lg:gap-[55px]`}
      >
        <div className="flex flex-col gap-8">
          <h2 className="text-4xl font-semibold tracking-tight">
            About {firstName}
          </h2>
          <div className="flex flex-col gap-5">
            <ListedBy label="Creative profile" name={person.name} />
            {facts.length > 0 && <FactsRow items={facts} />}
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {person.bio ?? `${firstName} hasn't written a bio yet.`}
          </p>

          {specialties.length > 0 && (
            <section className="flex flex-col gap-4">
              <SectionTitle>Specialties</SectionTitle>
              <BulletList items={specialties} />
            </section>
          )}

          {person.socials.length > 0 && (
            <section className="flex flex-col gap-4">
              <SectionTitle>Find {firstName} online</SectionTitle>
              <SocialLinks socials={person.socials} />
            </section>
          )}

          {feed && isSocialPlatform(feed) && (
            <Suspense fallback={<LatestPostsSkeleton />}>
              <LatestPosts personId={person.id} platform={feed} />
            </Suspense>
          )}

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
          {/* Same shell as the listing price panel. */}
          <div className="flex flex-col gap-8 rounded-xl bg-card p-6 lg:sticky lg:top-6">
            {person.phone && (
              <p className="rounded-sm bg-white py-4 text-center font-heading text-2xl font-bold dark:bg-muted">
                {person.phone}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2 text-sm">
                <span aria-hidden className="size-2.5 rounded-full bg-olive" />
                On ArtMostSphere
              </p>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Reach {firstName} directly to talk through your shoot. Bookings
                and hires are requested from listings in Talent and Cast,
                Locations and Gear.
              </p>
            </div>
            {person.phone ? (
              <a
                href={`tel:${person.phone.replace(/[^\d+]/g, "")}`}
                className={buttonClasses({
                  size: "lg",
                  className: "h-[66px] w-full text-[15px] font-normal",
                })}
              >
                Call {firstName}
              </a>
            ) : (
              <ButtonLink
                href="/cast"
                size="lg"
                className="h-[66px] w-full text-[15px] font-normal"
              >
                Browse talent
              </ButtonLink>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}

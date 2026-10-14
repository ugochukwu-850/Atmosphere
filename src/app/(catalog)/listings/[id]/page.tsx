import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { WIDE } from "@/components/catalog/SearchBand";
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
import { getItem } from "@/lib/data/catalog";
import { formatNgn, titleCase } from "@/lib/format";
import { param } from "@/lib/search-params";

export async function generateMetadata({
  params,
}: PageProps<"/listings/[id]">): Promise<Metadata> {
  const item = await getItem((await params).id);
  return item ? { title: item.title, description: item.description } : {};
}

// `params` is request-time data under cacheComponents, so it is read inside Suspense.
export default function ListingPage({
  params,
  searchParams,
}: PageProps<"/listings/[id]">) {
  return (
    <Suspense fallback={<div className={`${WIDE} h-[70vh]`} />}>
      <ListingContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

type Kind = "location" | "gear" | "gear_sale";

// Copy per listing type. Location wording is from the Figma frame; gear follows it.
const COPY: Record<
  Kind,
  {
    crumb: { href: string; label: string };
    badge: string;
    listing: string;
    about: string;
    details: string;
    before: { title: string; text: string };
    infoTitle: string;
    info: string;
    back: string;
    status: string;
    note: string;
    verb: string;
    noun: string;
  }
> = {
  location: {
    crumb: { href: "/locations", label: "Locations" },
    badge: "Bookable",
    listing: "Production Listing",
    about: "About this space",
    details: "Production details",
    before: {
      title: "Before you request",
      text: "Listed space. Check availability and production requirements with the host.",
    },
    infoTitle: "Booking information",
    info: "This space is listed as bookable. Share your shoot dates and requirements with the provider after signing in. The provider can confirm availability and any location-specific terms.",
    back: "Back to all places",
    status: "Bookable listing",
    note: "Review the full location details, then sign in to request a booking from the provider.",
    verb: "Request to book",
    noun: "booking",
  },
  gear: {
    crumb: { href: "/gear", label: "Gear" },
    badge: "For rent",
    listing: "Gear Listing",
    about: "About this kit",
    details: "In the kit",
    before: {
      title: "Before you rent",
      text: "Check the serial and kit list with the owner at pickup and again at return.",
    },
    infoTitle: "Rental information",
    info: "This kit is available to rent by the day. Share your dates after signing in; the owner confirms availability, deposit and handoff.",
    back: "Back to all gear",
    status: "Available to rent",
    note: "Review the kit details, then sign in to request a rental from the owner.",
    verb: "Request rental",
    noun: "rental",
  },
  gear_sale: {
    crumb: { href: "/gear/sale", label: "Gear for sale" },
    badge: "For sale",
    listing: "Gear Listing",
    about: "About this kit",
    details: "Included",
    before: {
      title: "Before you buy",
      text: "Inspect the kit in person and confirm the serial before you pay.",
    },
    infoTitle: "Buying information",
    info: "Purchase requests and checkout are coming soon. For now, contact the seller from their profile to arrange a viewing.",
    back: "Back to gear for sale",
    status: "For sale",
    note: "Contact the seller to arrange a viewing and agree the price.",
    verb: "Contact seller",
    noun: "purchase",
  },
};

/** Free-text kit list ("ballast, dome, 5m power") as bullet items. */
const splitList = (text?: string) =>
  (text ?? "")
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

async function ListingContent({
  params,
  searchParams,
}: Pick<PageProps<"/listings/[id]">, "params" | "searchParams">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [item, token] = await Promise.all([getItem(id), getSessionToken()]);
  if (!item) notFound();
  if (item.kind === "talent") redirect(`/cast/talent/${item.id}`);

  const kind = item.kind as Kind;
  const copy = COPY[kind];
  const place = [item.neighborhood, item.city].filter(Boolean).join(" ");
  const sale = kind === "gear_sale";
  const amount = sale ? item.salePriceNgn : item.dayRateNgn;
  const details = splitList(item.accessories);

  return (
    <article className="pb-24">
      <DetailHeader
        crumbs={[
          { href: "/", label: "Home" },
          copy.crumb,
          { label: item.title },
        ]}
        title={item.title}
        facts={[copy.badge, place, copy.listing]}
      />
      <Gallery
        photos={item.photoUrl ? [item.photoUrl] : []}
        title={item.title}
      />

      <div
        className={`${WIDE} mt-16 grid gap-12 lg:grid-cols-[minmax(0,876fr)_minmax(0,475fr)] lg:gap-[55px]`}
      >
        <div className="flex flex-col gap-8">
          <h2 className="text-4xl font-semibold tracking-tight">
            {copy.about}
          </h2>
          <div className="flex flex-col gap-5">
            <ListedBy
              label={item.owner ? "Listed by" : "Listed by a local provider"}
              name={item.owner?.name ?? place}
              href={item.owner ? `/people/${item.owner.id}` : undefined}
            />
            <FactsRow
              items={[
                titleCase(item.category),
                sale
                  ? `Asking ${formatNgn(amount)}`
                  : `Rate ${formatNgn(amount)} / day`,
                ...(item.serialNumber ? [`Serial ${item.serialNumber}`] : []),
                copy.badge,
              ]}
            />
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {item.description}
          </p>

          {details.length > 0 && (
            <section className="flex flex-col gap-4">
              <SectionTitle>{copy.details}</SectionTitle>
              <BulletList items={details} />
            </section>
          )}

          <section className="flex flex-col gap-4">
            <SectionTitle>Access and production notes</SectionTitle>
            <Callout title={copy.before.title}>{copy.before.text}</Callout>
          </section>

          <section className="flex flex-col gap-3">
            <SectionTitle>{copy.infoTitle}</SectionTitle>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {copy.info}
            </p>
          </section>

          <ButtonLink
            href={copy.crumb.href}
            variant="outline"
            className="mt-6 h-12 self-start px-5 text-sm font-normal"
          >
            <ChevronLeft className="size-4" />
            {copy.back}
          </ButtonLink>
        </div>

        <aside className="lg:pt-[88px]">
          <PricePanel
            amountNgn={amount}
            unit={sale ? " asking" : "/per day"}
            status={{ label: copy.status, tone: sale ? "sand" : "olive" }}
            note={copy.note}
          >
            {sale ? (
              item.owner ? (
                <ButtonLink
                  href={`/people/${item.owner.id}`}
                  size="lg"
                  className="h-[66px] w-full rounded-sm text-[15px] font-normal"
                >
                  {copy.verb}
                </ButtonLink>
              ) : null
            ) : (
              <RequestButton
                listingId={item.id}
                dayRateNgn={item.dayRateNgn}
                verb={copy.verb}
                noun={copy.noun}
                signedIn={Boolean(token)}
                autoOpen={param(sp, "request") === "1"}
              />
            )}
          </PricePanel>
        </aside>
      </div>
    </article>
  );
}

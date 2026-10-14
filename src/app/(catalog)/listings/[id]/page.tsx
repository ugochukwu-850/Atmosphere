import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RequestCard } from "@/components/booking/RequestCard";
import { placeLabel } from "@/components/catalog/place";
import { DetailSection, TagList } from "@/components/listing/DetailSection";
import { Gallery } from "@/components/listing/Gallery";
import { MapView } from "@/components/map/MapView";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/typography";
import type { Listing } from "@/lib/api/generated";
import { getSessionToken } from "@/lib/auth/session";
import { getListing } from "@/lib/data/catalog";
import { formatNgn, titleCase } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/listings/[id]">): Promise<Metadata> {
  const listing = await getListing((await params).id);
  return listing ? { title: listing.title, description: listing.description } : {};
}

// `params` is request-time data under cacheComponents, so it is read inside Suspense.
export default function ListingPage({ params }: PageProps<"/listings/[id]">) {
  return (
    <Suspense fallback={<Container className="h-[60vh] py-10" />}>
      <ListingContent params={params} />
    </Suspense>
  );
}

const BACK: Record<Listing["kind"], { href: string; label: string }> = {
  location: { href: "/locations", label: "Locations" },
  gear_rent: { href: "/gear", label: "Rent gear" },
  gear_sale: { href: "/gear/sale", label: "Buy gear" },
};

async function ListingContent({ params }: Pick<PageProps<"/listings/[id]">, "params">) {
  const { id } = await params;
  const [listing, token] = await Promise.all([getListing(id), getSessionToken()]);
  if (!listing) notFound();

  const back = BACK[listing.kind];
  const hasPin = listing.place.lat !== undefined && listing.place.lng !== undefined;

  return (
    <Container className="flex flex-col gap-8 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href={back.href} className="hover:text-foreground">
          {back.label}
        </Link>{" "}
        / <span className="text-foreground">{listing.title}</span>
      </nav>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">{titleCase(listing.category)}</Badge>
          {listing.status !== "published" && <Badge>{titleCase(listing.status)}</Badge>}
        </div>
        <h1 className="text-4xl font-bold md:text-5xl">{listing.title}</h1>
        <p className="text-muted-foreground">
          {placeLabel(listing.place)} · Listed by{" "}
          <Link href={`/people/${listing.owner.id}`} className="font-medium text-foreground hover:text-primary">
            {listing.owner.name}
          </Link>
        </p>
      </header>

      <Gallery photos={listing.photos} title={listing.title} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">
              {listing.kind === "location" ? "About this space" : "About this kit"}
            </h2>
            <p className="leading-relaxed text-muted-foreground">{listing.description}</p>
            {listing.location && (
              <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                {listing.location.sizeSqm && (
                  <div>
                    <dt className="text-muted-foreground">Size</dt>
                    <dd className="font-medium">{listing.location.sizeSqm} m²</dd>
                  </div>
                )}
                {listing.location.capacity && (
                  <div>
                    <dt className="text-muted-foreground">Crew capacity</dt>
                    <dd className="font-medium">{listing.location.capacity} people</dd>
                  </div>
                )}
              </dl>
            )}
          </section>

          {listing.location?.amenities?.length ? (
            <DetailSection title="Amenities">
              <TagList items={listing.location.amenities} />
            </DetailSection>
          ) : null}

          {listing.gear && (
            <DetailSection title="Kit details">
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                {listing.gear.brand && (
                  <div>
                    <dt className="text-muted-foreground">Make and model</dt>
                    <dd className="font-medium">
                      {listing.gear.brand} {listing.gear.model}
                    </dd>
                  </div>
                )}
                {listing.gear.serial && (
                  <div>
                    <dt className="text-muted-foreground">Serial</dt>
                    <dd className="font-mono font-medium">{listing.gear.serial}</dd>
                  </div>
                )}
                {listing.gear.condition && (
                  <div>
                    <dt className="text-muted-foreground">Condition</dt>
                    <dd className="font-medium">{titleCase(listing.gear.condition)}</dd>
                  </div>
                )}
              </dl>
              {listing.gear.kitContents?.length ? (
                <>
                  <p className="text-sm text-muted-foreground">In the kit</p>
                  <TagList items={listing.gear.kitContents} />
                </>
              ) : null}
            </DetailSection>
          )}

          {listing.location?.rules?.length ? (
            <DetailSection title="House rules">
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {listing.location.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {hasPin && (
            <DetailSection title="Where it is">
              <p className="text-sm text-muted-foreground">
                {listing.location?.accessNotes ?? "Exact address is shared once the request is accepted."}
              </p>
              <MapView
                center={{ lat: listing.place.lat!, lng: listing.place.lng! }}
                zoom={14}
                markers={[
                  {
                    id: listing.id,
                    title: listing.title,
                    lat: listing.place.lat!,
                    lng: listing.place.lng!,
                    kind: "bookable",
                  },
                ]}
                className="h-72"
              />
            </DetailSection>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          {listing.kind === "gear_sale" ? (
            <Card className="flex flex-col gap-3 p-6">
              <p className="font-heading text-2xl font-bold">
                {formatNgn(listing.askingPriceNgn ?? 0)}
                <span className="text-sm font-normal text-muted-foreground"> asking</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Purchase requests and checkout are coming soon. Message the seller from their profile.
              </p>
              <Link href={`/people/${listing.owner.id}`} className="text-sm font-medium text-primary hover:underline">
                View {listing.owner.name}&apos;s profile
              </Link>
            </Card>
          ) : (
            <RequestCard
              target={{ listingId: listing.id }}
              dayRateNgn={listing.dayRateNgn ?? 0}
              verb={listing.kind === "location" ? "Request booking" : "Request rental"}
              noteLabel="Note to owner"
              signedIn={Boolean(token)}
              disclaimer="You won't be charged yet. The owner confirms dates and payment."
            />
          )}
        </aside>
      </div>
    </Container>
  );
}

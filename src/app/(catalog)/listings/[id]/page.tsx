import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { RequestCard } from "@/components/booking/RequestCard";
import { placeLabel } from "@/components/catalog/place";
import { DetailSection, TagList } from "@/components/listing/DetailSection";
import { Gallery } from "@/components/listing/Gallery";
import { MapView } from "@/components/map/MapView";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/typography";
import { getSessionToken } from "@/lib/auth/session";
import { getItem } from "@/lib/data/catalog";
import type { ItemKind } from "@/lib/data/types";
import { formatNgn, titleCase } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/listings/[id]">): Promise<Metadata> {
  const item = await getItem((await params).id);
  return item ? { title: item.title, description: item.description } : {};
}

// `params` is request-time data under cacheComponents, so it is read inside Suspense.
export default function ListingPage({ params }: PageProps<"/listings/[id]">) {
  return (
    <Suspense fallback={<Container className="h-[60vh] py-10" />}>
      <ListingContent params={params} />
    </Suspense>
  );
}

const BACK: Record<
  Exclude<ItemKind, "talent">,
  { href: string; label: string }
> = {
  location: { href: "/locations", label: "Locations" },
  gear: { href: "/gear", label: "Rent gear" },
  gear_sale: { href: "/gear/sale", label: "Buy gear" },
};

/** Kit contents arrive as free text ("ballast, dome, 5m power"). */
const kitItems = (accessories?: string) =>
  (accessories ?? "")
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

async function ListingContent({
  params,
}: Pick<PageProps<"/listings/[id]">, "params">) {
  const { id } = await params;
  const [item, token] = await Promise.all([getItem(id), getSessionToken()]);
  if (!item) notFound();
  if (item.kind === "talent") redirect(`/cast/talent/${item.id}`);

  const back = BACK[item.kind];
  const isGear = item.kind !== "location";
  const kit = kitItems(item.accessories);

  return (
    <Container className="flex flex-col gap-8 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href={back.href} className="hover:text-foreground">
          {back.label}
        </Link>{" "}
        / <span className="text-foreground">{item.title}</span>
      </nav>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {item.category && (
            <Badge variant="primary">{titleCase(item.category)}</Badge>
          )}
          {item.status !== "published" && (
            <Badge>{titleCase(item.status)}</Badge>
          )}
        </div>
        <h1 className="text-4xl font-bold md:text-5xl">{item.title}</h1>
        <p className="text-muted-foreground">
          {placeLabel(item)}
          {item.owner && (
            <>
              {" · Listed by "}
              <Link
                href={`/people/${item.owner.id}`}
                className="font-medium text-foreground hover:text-primary"
              >
                {item.owner.name}
              </Link>
            </>
          )}
        </p>
      </header>

      <Gallery photoUrl={item.photoUrl} title={item.title} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">
              {isGear ? "About this kit" : "About this space"}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </section>

          {isGear && (item.serialNumber || kit.length > 0) && (
            <DetailSection title="Kit details">
              {item.serialNumber && (
                <dl className="text-sm">
                  <dt className="text-muted-foreground">Serial</dt>
                  <dd className="font-mono font-medium">{item.serialNumber}</dd>
                </dl>
              )}
              {kit.length > 0 && (
                <>
                  <p className="text-sm text-muted-foreground">In the kit</p>
                  <TagList items={kit} />
                </>
              )}
            </DetailSection>
          )}

          {item.owner && (
            <DetailSection title={`About ${item.owner.name}`}>
              {item.owner.bio && (
                <p className="text-sm text-muted-foreground">
                  {item.owner.bio}
                </p>
              )}
              <Link
                href={`/people/${item.owner.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                View profile
              </Link>
            </DetailSection>
          )}

          {item.lat !== undefined && item.lng !== undefined && (
            <DetailSection title="Where it is">
              <p className="text-sm text-muted-foreground">
                {item.neighborhood}, {item.city}. The exact address is shared
                once the request is accepted.
              </p>
              <MapView
                center={{ lat: item.lat, lng: item.lng }}
                zoom={14}
                markers={[
                  {
                    id: item.id,
                    title: item.title,
                    lat: item.lat,
                    lng: item.lng,
                    kind: "bookable",
                  },
                ]}
                className="h-72"
              />
            </DetailSection>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          {item.kind === "gear_sale" ? (
            <Card className="flex flex-col gap-3 p-6">
              <p className="font-heading text-2xl font-bold">
                {formatNgn(item.salePriceNgn)}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  asking
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Purchase requests and checkout are coming soon. Contact the
                seller from their profile.
              </p>
              {item.owner && (
                <Link
                  href={`/people/${item.owner.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View {item.owner.name}&apos;s profile
                </Link>
              )}
            </Card>
          ) : (
            <RequestCard
              listingId={item.id}
              dayRateNgn={item.dayRateNgn}
              verb={
                item.kind === "location" ? "Request booking" : "Request rental"
              }
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

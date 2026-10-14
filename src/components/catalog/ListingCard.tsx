import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Listing } from "@/lib/api/generated";
import { formatNgn, titleCase } from "@/lib/format";

import { placeLabel } from "./place";

export function listingPrice(listing: Listing): string | null {
  if (listing.kind === "gear_sale" && listing.askingPriceNgn !== undefined) {
    return `${formatNgn(listing.askingPriceNgn)} asking`;
  }
  if (listing.dayRateNgn !== undefined) return `${formatNgn(listing.dayRateNgn)} / day`;
  return null;
}

export function ListingCard({ listing }: { listing: Listing }) {
  const cover = listing.photos[0];
  const price = listingPrice(listing);

  return (
    <Link href={`/listings/${listing.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        {cover && (
          <Image
            src={cover.url}
            alt={cover.alt ?? listing.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <Badge variant="ink" className="absolute top-3 left-3">
          {titleCase(listing.category)}
        </Badge>
        {listing.kind === "gear_sale" && (
          <Badge variant="primary" className="absolute top-3 right-3 bg-primary text-primary-foreground">
            For sale
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg leading-snug font-semibold group-hover:text-primary">
          {listing.title}
        </h3>
        <p className="text-sm text-muted-foreground">{placeLabel(listing.place)}</p>
        {price && <p className="text-sm font-semibold">{price}</p>}
      </div>
    </Link>
  );
}

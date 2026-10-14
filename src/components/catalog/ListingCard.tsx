import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { CatalogItem } from "@/lib/data/types";
import { formatNgn, titleCase } from "@/lib/format";

import { placeLabel } from "./place";

export function itemPrice(item: CatalogItem): string | null {
  if (item.kind === "gear_sale") return item.salePriceNgn ? `${formatNgn(item.salePriceNgn)} asking` : null;
  return item.dayRateNgn ? `${formatNgn(item.dayRateNgn)} / day` : null;
}

export function ListingCard({ item }: { item: CatalogItem }) {
  const price = itemPrice(item);

  return (
    <Link href={`/listings/${item.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        {item.photoUrl && (
          <Image
            src={item.photoUrl}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {item.category && (
          <Badge variant="ink" className="absolute top-3 left-3">
            {titleCase(item.category)}
          </Badge>
        )}
        {item.kind === "gear_sale" && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">For sale</Badge>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg leading-snug font-semibold group-hover:text-primary">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{placeLabel(item)}</p>
        {price && <p className="text-sm font-semibold">{price}</p>}
      </div>
    </Link>
  );
}

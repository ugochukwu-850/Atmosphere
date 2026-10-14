import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import type { CatalogItem } from "@/lib/data/types";
import { formatNgn, titleCase } from "@/lib/format";

import { placeLabel } from "./place";

/** Talent titles come as "Amaka Eze — actor / model". */
export function splitTalentTitle(title: string): {
  name: string;
  headline?: string;
} {
  const [name, ...rest] = title.split(" — ");
  return { name: name ?? title, headline: rest.join(" — ") || undefined };
}

export function roleLabel(role: string): string {
  return role.toLowerCase() === "dp" ? "DP" : titleCase(role);
}

export function TalentCard({ item }: { item: CatalogItem }) {
  const { name, headline } = splitTalentTitle(item.title);

  return (
    <Link
      href={`/cast/talent/${item.id}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        <SafeImage
          src={item.photoUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.category && (
          <Badge variant="ink" className="absolute top-3 left-3">
            {roleLabel(item.category)}
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-semibold group-hover:text-primary">
          {name}
        </h3>
        {headline && <p className="text-sm">{titleCase(headline)}</p>}
        <p className="text-sm text-muted-foreground">{placeLabel(item)}</p>
        {item.dayRateNgn > 0 && (
          <p className="text-sm font-semibold">
            {formatNgn(item.dayRateNgn)} / day
          </p>
        )}
      </div>
    </Link>
  );
}

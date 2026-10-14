import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Talent } from "@/lib/api/generated";
import { formatNgn, titleCase } from "@/lib/format";

import { placeLabel } from "./place";

export function TalentCard({ talent }: { talent: Talent }) {
  const cover = talent.photos?.[0];

  return (
    <Link href={`/cast/talent/${talent.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        {cover && (
          <Image
            src={cover.url}
            alt={talent.user.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {talent.roles.map((role) => (
            <Badge key={role} variant="ink">
              {role === "dp" ? "DP" : titleCase(role)}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-semibold group-hover:text-primary">{talent.user.name}</h3>
        <p className="text-sm">{talent.headline}</p>
        <p className="text-sm text-muted-foreground">{placeLabel(talent.place)}</p>
        {talent.dayRateNgn !== undefined && (
          <p className="text-sm font-semibold">{formatNgn(talent.dayRateNgn)} / day</p>
        )}
      </div>
    </Link>
  );
}

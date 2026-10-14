import Image from "next/image";

import type { Photo } from "@/lib/api/generated";

/** One large photo plus up to four in a 2×2 grid (Figma: Location Detail). */
export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [hero, ...rest] = photos;
  if (!hero) return <div className="aspect-[16/9] rounded-xl bg-muted" />;

  return (
    <div className="grid gap-2 md:grid-cols-2 md:grid-rows-2 md:[height:min(36rem,60vw)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl md:row-span-2 md:aspect-auto md:rounded-r-none">
        <Image src={hero.url} alt={hero.alt ?? title} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="hidden grid-cols-2 gap-2 md:row-span-2 md:grid">
        {rest.slice(0, 4).map((p, i) => (
          <div
            key={p.url}
            className={`relative overflow-hidden ${i === 1 ? "rounded-tr-xl" : ""} ${i === 3 ? "rounded-br-xl" : ""}`}
          >
            <Image src={p.url} alt={p.alt ?? `${title} ${i + 2}`} fill sizes="25vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

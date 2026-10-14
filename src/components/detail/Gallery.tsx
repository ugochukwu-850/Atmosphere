import { WIDE } from "@/components/catalog/SearchBand";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";

/**
 * Large photo plus two stacked on the right (Figma: Location Detail). The API
 * serves one photo per listing today, so a single photo spans the full width.
 */
export function Gallery({
  photos,
  title,
}: {
  photos: string[];
  title: string;
}) {
  const [main, ...rest] = photos;
  const side = rest.slice(0, 2);

  return (
    <div className={cn(WIDE, "mt-8")}>
      <div
        className={cn(
          "grid gap-2 md:gap-[33px]",
          side.length > 0 && "md:grid-cols-[minmax(0,876fr)_minmax(0,497fr)]",
        )}
      >
        <div className="relative aspect-[876/743] max-h-[743px] overflow-hidden rounded-xl bg-muted md:aspect-auto md:h-[min(743px,52vw)]">
          <SafeImage
            src={main}
            alt={title}
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
          {rest.length > 0 && (
            <span className="absolute bottom-9 left-9 bg-white px-2 py-2 text-base text-charcoal uppercase">
              View all photos
            </span>
          )}
        </div>
        {side.length > 0 && (
          <div className="hidden grid-rows-2 gap-[7px] md:grid">
            {side.map((src, i) => (
              <div
                key={src}
                className="relative overflow-hidden rounded-xl bg-muted"
              >
                <SafeImage
                  src={src}
                  alt={`${title} photo ${i + 2}`}
                  fill
                  sizes="35vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

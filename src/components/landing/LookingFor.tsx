import Image from "next/image";

import { cn } from "@/lib/utils";

import { LANDING_MEDIA } from "./media";

// Fanned photo stack: centre card in front, outer cards tilted (Figma: Rectangle 12–14).
const CARDS = [
  {
    src: LANDING_MEDIA.lookingFor[0],
    className: "-rotate-6 translate-x-6 translate-y-4 z-0",
  },
  { src: LANDING_MEDIA.lookingFor[1], className: "z-10" },
  {
    src: LANDING_MEDIA.lookingFor[2],
    className: "rotate-6 -translate-x-6 translate-y-4 z-0",
  },
] as const;

export function LookingFor() {
  return (
    <section className="flex flex-col items-center gap-12 px-5 py-20 text-center md:py-28">
      <h2 className="text-4xl font-medium tracking-[-0.01em] md:text-5xl">
        What are you looking for?
      </h2>
      <div aria-hidden className="flex items-start justify-center">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={cn(
              "relative aspect-[315/354] w-[28vw] max-w-[315px] overflow-hidden rounded-md border-4 border-white shadow-[0_12px_30px_rgb(0_0_0/0.18)]",
              card.className,
            )}
          >
            <Image
              src={card.src}
              alt=""
              fill
              sizes="315px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <p className="max-w-[25rem] text-lg text-charcoal-600 dark:text-muted-foreground">
        A place, the right kit, the right people—or a plan to bring it all
        together.
      </p>
    </section>
  );
}

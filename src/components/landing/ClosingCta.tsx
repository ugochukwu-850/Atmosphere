import { ButtonLink } from "@/components/ui/button";

import { LANDING_MEDIA } from "./media";

/** Image-filled "YOUR NEXT PRODUCTION STARTS HERE." (Figma: Frame 64) */
export function ClosingCta() {
  return (
    <section className="flex flex-col items-center gap-12 px-5 pt-16 pb-24 text-center md:pt-24">
      <h2
        className="bg-cover bg-clip-text bg-center font-heading text-5xl leading-[0.88] font-bold tracking-[-0.01em] text-transparent uppercase md:text-[100px]"
        style={{ backgroundImage: `url(${LANDING_MEDIA.cta})` }}
      >
        Your next
        <br />
        production
        <br />
        starts here.
      </h2>
      <ButtonLink href="/locations" size="xl">
        Explore
      </ButtonLink>
    </section>
  );
}

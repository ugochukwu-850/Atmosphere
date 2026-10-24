import Image from "next/image";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/** Photo exported from the Figma "Onboarding" frames (image 4). */
const HERO_PHOTO = "/images/onboarding/crew.png";

/** Tilted category tags, positioned as in the frame (offsets of a 576px row). */
const TAGS = [
  {
    label: "Location",
    className:
      "top-[12px] left-[0.43%] -rotate-[7.55deg] bg-primary text-panel",
  },
  {
    label: "Gear",
    className: "top-[59.5px] left-[32.99%] rotate-[1.5deg] bg-olive text-panel",
  },
  {
    label: "Talent & Cast",
    className:
      "top-[25px] left-[67.19%] rotate-[5.99deg] bg-sand text-charcoal",
  },
] as const;

/** Photo card on the left of every onboarding step (836×852 in the frame). */
function OnboardingHero() {
  return (
    <div className="relative isolate h-[852px] overflow-hidden rounded-[40px] bg-sand text-white">
      {/* The frame crops a 1536×1017 photo around the card's centre. It's the
          LCP on desktop; below xl the card is hidden, so `sizes` asks for the
          smallest variant there. */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[1017px] w-[1536px] -translate-1/2">
        <Image
          src={HERO_PHOTO}
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 1280px) 1536px, 1px"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/40" />

      <div className="absolute top-[483px] right-14 left-14">
        <p className="font-heading text-[9.7px] leading-[13.4px] font-medium tracking-[0.375em] text-sand-800 uppercase">
          The production ecosystem for Africa
        </p>
        <p className="mt-[15px] max-w-[568px] font-heading text-[57.5px] leading-[0.825] font-semibold tracking-[-0.01em]">
          Find What Your Next <span className="text-sand">Shoot Needs.</span>
        </p>
        <p className="mt-[13px] max-w-[424px] text-[12.9px] leading-5">
          Locations. Gear. Cast. Planning. All in one production space. Move
          from a first idea to the people and resources that bring it to life.
        </p>
      </div>

      <ul
        aria-label="What you can find"
        className="absolute top-[682px] right-14 left-14 h-[110px] max-w-[576px]"
      >
        {TAGS.map((tag) => (
          <li
            key={tag.label}
            className={cn(
              "absolute grid h-[50px] w-[189px] place-items-center rounded-[14.25px] text-[21.4px] font-semibold",
              tag.className,
            )}
          >
            {tag.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Onboarding frame ("Onboarding" / "Viewer Bording" in Figma): photo card on
 * the left, the current step in a 578px column on the right. The card drops
 * out below xl, where it would squeeze the form.
 */
export function OnboardingShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-[1512px] gap-6 px-5 pt-10 pb-16 md:px-10 xl:grid-cols-[minmax(0,1fr)_578px] xl:pt-[30px] xl:pr-12 xl:pb-[41px] xl:pl-[26px]">
      <div className="hidden xl:block">
        <OnboardingHero />
      </div>
      <div className="mx-auto flex w-full max-w-[578px] flex-col xl:pt-[34px]">
        {children}
      </div>
    </div>
  );
}

/** Step bars, eyebrow, title and intro at the top of each step. */
export function OnboardingHeading({
  step,
  eyebrow,
  title,
  description,
  className,
}: {
  /** 1-based; bars up to this one are filled. */
  step: number;
  eyebrow: string;
  title: string;
  description: string;
  /** Spacing between the eyebrow and the title (differs per frame). */
  className?: string;
}) {
  return (
    <div className="flex flex-col">
      <p className="sr-only">Step {step} of 3</p>
      <div aria-hidden className="flex gap-3">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn(
              "h-[13px] w-[99px] rounded-[5px]",
              n <= step ? "bg-primary" : "bg-[#d9d9d9] dark:bg-white/20",
            )}
          />
        ))}
      </div>
      <Eyebrow className="mt-[43px] font-heading text-xl leading-normal font-normal">
        {eyebrow}
      </Eyebrow>
      <div className={cn("mt-[25px] flex flex-col gap-5", className)}>
        <h1 className="font-sans text-3xl leading-normal font-bold md:text-[39px]">
          {title}
        </h1>
        <p className="text-base leading-normal md:text-xl">{description}</p>
      </div>
    </div>
  );
}

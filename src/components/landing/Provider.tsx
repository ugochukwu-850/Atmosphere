import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";

import { LANDING_MEDIA } from "./media";

const OFFERINGS = ["Location", "Gear", "Talent", "Creative Service"] as const;

/** "Have a resource filmmakers need?" (Figma: Frame 42) */
export function Provider() {
  return (
    <section className="relative isolate flex min-h-[44rem] items-end overflow-hidden text-white lg:min-h-[940px]">
      <Image
        src={LANDING_MEDIA.provider}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-black/45" />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 pb-24 text-center lg:pb-64">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-base">
          {OFFERINGS.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span aria-hidden className="size-2.5 rounded-full bg-sand" />
              {item}
            </li>
          ))}
        </ul>
        <h2 className="text-5xl leading-[0.83] font-semibold tracking-[-0.01em] md:text-[80px]">
          Have a resource
          <br />
          <span className="text-sand">filmmakers</span> need?
        </h2>
        <p className="max-w-[43rem] text-lg text-white/95">
          Whether you own a studio, rent out cameras, manage a unique location
          or provide production talent, ArtMostSphere gives you a place to
          showcase what you offer.
        </p>
        <ButtonLink href="/list" size="xl" className="mt-6">
          Become A Provider
        </ButtonLink>
      </div>
    </section>
  );
}

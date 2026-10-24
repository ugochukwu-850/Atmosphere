import Image from "next/image";

import { Eyebrow } from "@/components/ui/typography";

import { LANDING_MEDIA } from "./media";

/** "Production is bigger than the camera." (Figma: Frame 95) */
export function About() {
  return (
    <section id="about" className="grid scroll-mt-4 lg:grid-cols-[51%_49%]">
      <div className="relative min-h-[28rem] lg:min-h-[64rem]">
        <Image
          src={LANDING_MEDIA.about}
          alt="A camera crew on set"
          fill
          sizes="(min-width: 1024px) 51vw, 100vw"
          className="object-cover"
        />
        <p className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white px-3 py-2.5 text-lg whitespace-nowrap text-charcoal uppercase">
          Built for the people who make things
        </p>
      </div>
      <div className="flex flex-col justify-center gap-6 bg-ivory px-6 py-16 text-charcoal md:px-10 lg:py-24">
        <Eyebrow className="text-lg">About us</Eyebrow>
        <h2 className="text-5xl leading-[0.98] font-bold tracking-tight md:text-[67px]">
          Production is
          <br />
          bigger than the
          <br />
          camera.
        </h2>
        <div className="flex max-w-[37rem] flex-col gap-6 text-lg leading-relaxed text-charcoal-600">
          <p>
            Every great production is built on a network of people, places,
            equipment, ideas, and decisions. But finding and coordinating those
            resources is often fragmented, time-consuming, and difficult.
          </p>
          <p className="font-bold">ArtMostSphere brings it all together.</p>
          <p>
            We&apos;re building a production platform that makes it easier to
            discover the people, locations, equipment, and resources behind
            film, photography, advertising, music, television, and digital
            content. Starting in Nigeria, we&apos;re building the infrastructure
            for a more connected production ecosystem, one project at a time.
          </p>
        </div>
        <div className="mt-6 max-w-[34rem] border-l-4 border-primary py-1 pl-5">
          <p className="text-xs text-primary uppercase">Our vision</p>
          <p className="mt-3 text-base font-semibold">
            To become the operating system for production across Africa.
          </p>
          <p className="mt-1 text-[11px] text-charcoal-600">
            Not just another marketplace. A place where ideas find resources,
            resources find productions, and creative teams can build with less
            friction.
          </p>
        </div>
      </div>
    </section>
  );
}

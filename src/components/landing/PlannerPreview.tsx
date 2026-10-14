import { Calendar, ChevronRight, FileText, MapPin, Video } from "lucide-react";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import { LANDING_MEDIA } from "./media";

const META = [
  { icon: Calendar, label: "Shoot Date", value: "Apr 26, 2027" },
  { icon: MapPin, label: "Location", value: "Lagos, Nigeria" },
  { icon: Video, label: "Shoot Type", value: "Fashion Runway" },
] as const;

const TABS = [
  "Overview",
  "Location",
  "Rent Gear",
  "Talent",
  "Timeline",
  "Budget",
  "Note",
] as const;

const REQUIREMENTS = [
  {
    title: "Location",
    detail: "Modern Lagos Apartment",
    image: LANDING_MEDIA.planner.location,
  },
  {
    title: "Camera",
    detail: "Cinema Camera",
    image: LANDING_MEDIA.planner.camera,
  },
  {
    title: "Lenses",
    detail: "24mm - 50mm - 85mm",
    image: LANDING_MEDIA.planner.lenses,
  },
  {
    title: "Lighting",
    detail: "LED Key - Fill - Practical",
    image: LANDING_MEDIA.planner.lighting,
  },
  {
    title: "Audio",
    detail: "Wireless Lav - Shotgun Mic",
    image: LANDING_MEDIA.planner.audio,
  },
  { title: "Cast", detail: "2 Models", image: LANDING_MEDIA.planner.cast },
] as const;

/** Static preview of a generated plan (Figma: Planner card). */
function PlanCard() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-xl bg-white text-charcoal shadow-[0_10px_40px_rgb(0_0_0/0.10)]"
    >
      <div className="relative h-56">
        <Image
          src={LANDING_MEDIA.planner.cover}
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white" />
        <div className="absolute inset-x-8 bottom-2">
          <p className="font-heading text-4xl font-semibold">
            Fashion Hall event
          </p>
          <p className="mt-2 max-w-[24rem] text-[11px] leading-snug text-charcoal-600">
            A spacious, high-end fashion and creative production hall in Lagos,
            designed to host fashion shows, runway events, photoshoots,
            exhibitions, designer showcases, and large-scale creative
            productions.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-8 pt-5 pb-8">
        <dl className="flex flex-wrap gap-x-10 gap-y-3">
          {META.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-charcoal-600" strokeWidth={1.5} />
              <div className="leading-tight">
                <dt className="text-[7px] text-charcoal-600">{label}</dt>
                <dd className="text-[9px]">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="flex gap-1 overflow-hidden rounded-md bg-ivory p-2">
          {TABS.map((tab, i) => (
            <span
              key={tab}
              className={cn(
                "flex-1 rounded-sm py-2 text-center text-xs whitespace-nowrap",
                i === 0 ? "bg-primary text-white" : "text-charcoal-600",
              )}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-md bg-ivory p-4">
          <div className="flex items-start gap-3">
            <FileText
              className="mt-0.5 size-5 text-charcoal-600"
              strokeWidth={1.5}
            />
            <div>
              <p className="text-sm font-medium">Production Requirements</p>
              <p className="text-[9px] text-charcoal-600">
                Here&apos;s what your production needs based on your brief
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {REQUIREMENTS.map((req) => (
              <div
                key={req.title}
                className="flex flex-col gap-2 rounded-md bg-white p-1.5"
              >
                <div className="relative aspect-[180/88] overflow-hidden rounded-sm">
                  <Image
                    src={req.image}
                    alt=""
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-end justify-between gap-2 px-0.5 pb-0.5">
                  <div>
                    <p className="text-[11px]">{req.title}</p>
                    <p className="text-[8px] text-charcoal-600">{req.detail}</p>
                  </div>
                  <ChevronRight className="size-3.5 text-charcoal-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlannerPreview() {
  return (
    <section className="py-20 md:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-5">
          <Eyebrow className="text-lg">Planner</Eyebrow>
          <h2 className="text-5xl leading-[0.92] font-bold tracking-tight md:text-[72px]">
            Have the idea.
            <br />
            We&apos;ll make it
            <br />
            happen.
          </h2>
          <p className="text-lg text-charcoal-600 dark:text-muted-foreground">
            Have the concept, script or moodboard?
            <br />
            The Production Planner turns your idea into a clear production plan.
          </p>
          <ButtonLink href="/planner" size="xl" className="mt-8 self-start">
            Plan a shoot
          </ButtonLink>
        </div>
        <PlanCard />
      </Container>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/typography";

import { LANDING_MEDIA } from "./media";

const CARDS = [
  {
    href: "/locations",
    kicker: "01 / LOCATION",
    title: "Find spaces that fit the story you're trying to tell.",
    image: LANDING_MEDIA.offer.location,
  },
  {
    href: "/gear",
    kicker: "02 / Gear",
    title: "Get access to the equipment your production needs.",
    image: LANDING_MEDIA.offer.gear,
  },
  {
    href: "/cast",
    kicker: "03 / Cast & Talent",
    title: "Find people who bring the production to life.",
    image: LANDING_MEDIA.offer.talent,
  },
] as const;

/** "Everything your production needs, in one place." (Figma: Group 1) */
export function Offer() {
  return (
    <section
      id="offer"
      className="scroll-mt-4 bg-ivory py-20 text-charcoal md:py-24"
    >
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="text-4xl font-medium tracking-[-0.01em] md:text-5xl">
            Everything your production <br className="max-md:hidden" />
            needs, in one place.
          </h2>
          <p className="max-w-[35rem] text-lg text-charcoal-600 lg:text-right">
            Production shouldn&apos;t mean searching through dozens of
            platforms, chats, contacts, and spreadsheets. Bring the resources
            together so you can spend less time searching and more time
            creating.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative isolate flex aspect-[424/492] flex-col justify-end overflow-hidden rounded-lg p-6 text-white"
            >
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <p className="flex items-center gap-2 text-[13px] text-white/90">
                <span aria-hidden className="h-px w-3 bg-sand" />
                {card.kicker}
              </p>
              <h3 className="mt-2 max-w-[19rem] text-xl leading-snug font-medium">
                {card.title}
              </h3>
              <span className="mt-3 inline-flex w-fit items-center gap-2 border-b border-white/70 pb-1 text-[13px]">
                Explore
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

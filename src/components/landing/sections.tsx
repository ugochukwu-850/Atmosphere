import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { ListingCard } from "@/components/catalog/ListingCard";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/typography";
import { getHome } from "@/lib/data/catalog";
import { placeholderPhoto as photo } from "@/lib/placeholder";

import { HeroSearch } from "./HeroSearch";

// ---------------------------------------------------------------- hero

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <Image
        src={photo("hero-set", 1920, 1080)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/30 via-ink/50 to-ink" />
      <Container className="flex min-h-[78vh] flex-col items-center justify-center gap-8 py-24 text-center">
        <Eyebrow>Africa&apos;s production OS · starting in Nigeria</Eyebrow>
        <h1 className="max-w-4xl text-5xl leading-[1.02] font-extrabold md:text-7xl">
          Find what your <span className="text-gold">next shoot</span> needs.
        </h1>
        <p className="max-w-2xl text-lg text-ink-foreground/75">
          Book locations, rent kit closest to set, and hire creatives — with a booking record you
          can trust.
        </p>
        <HeroSearch />
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------- categories

const CATEGORIES = [
  { href: "/locations", title: "Locations", text: "Studios, homes, rooftops and public spots.", seed: "cat-locations" },
  { href: "/gear", title: "Gear", text: "Cameras, lenses, lights and sound by the day.", seed: "cat-gear" },
  { href: "/cast", title: "Talent", text: "Actors, DPs, voice, sound and makeup.", seed: "cat-talent" },
] as const;

export function Categories() {
  return (
    <section className="py-20 md:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow>Browse</Eyebrow>
          <h2 className="text-4xl font-bold md:text-5xl">What are you looking for?</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link key={c.href} href={c.href} className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl p-6 text-ink-foreground">
              <Image src={photo(c.seed, 900, 1100)} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <h3 className="text-3xl font-bold">{c.title}</h3>
              <p className="text-sm text-ink-foreground/80">{c.text}</p>
              <span className="mt-4 text-sm font-medium text-gold">Explore →</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------- featured

export function Featured() {
  return (
    <section className="bg-muted py-20 md:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <Eyebrow>On the floor</Eyebrow>
            <h2 className="text-4xl font-bold md:text-5xl">Everything your production needs, in one place.</h2>
          </div>
          <ButtonLink href="/locations" variant="outline">
            All locations
          </ButtonLink>
        </div>
        <Suspense fallback={<div className="h-80" />}>
          <FeaturedGrid />
        </Suspense>
      </Container>
    </section>
  );
}

async function FeaturedGrid() {
  const { locations } = await getHome();
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {locations.slice(0, 3).map((item) => (
        <ListingCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- steps

const STEPS = [
  { n: "01", title: "Describe the shoot", text: "Drop your brief into the planner, or start from a location." },
  { n: "02", title: "Set the area", text: "Pick a state or city. Everything ranks by distance to set." },
  { n: "03", title: "Request dates", text: "Book spaces, rent kit and hire crew with one request flow." },
  { n: "04", title: "Keep the record", text: "Payment state, messages and gear handoffs in one place." },
] as const;

export function Steps() {
  return (
    <section className="bg-ink py-20 text-ink-foreground md:py-28">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="max-w-2xl text-4xl font-bold md:text-5xl">From idea to production without the chaos.</h2>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="flex flex-col gap-3 bg-ink p-6">
              <span className="font-heading text-4xl font-bold text-primary">{s.n}</span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-ink-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------- planner

const PLAN_TABS = ["Overview", "Location", "Rent Gear", "Talent", "Timeline", "Budget", "Note"] as const;

const REQUIREMENTS = [
  { label: "Location", detail: "Modern event space", seed: "req-location" },
  { label: "Camera", detail: "Cinema camera", seed: "req-camera" },
  { label: "Lenses", detail: "24 · 50 · 85mm", seed: "req-lenses" },
  { label: "Lighting", detail: "LED kit · tubes", seed: "req-lighting" },
  { label: "Audio", detail: "Wireless lav · mixer", seed: "req-audio" },
  { label: "Cast", detail: "12 models", seed: "req-cast" },
] as const;

export function PlannerTeaser() {
  return (
    <section className="py-20 md:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-5">
          <Eyebrow>Planner</Eyebrow>
          <h2 className="text-5xl leading-[1.02] font-bold md:text-6xl">
            Have the idea.
            <br />
            We&apos;ll make it happen.
          </h2>
          <p className="text-lg text-muted-foreground">
            Have the concept, script or moodboard? The Production Planner turns your idea into a clear
            production plan.
          </p>
          <ButtonLink href="/planner" size="lg" className="self-start">
            Plan a shoot
          </ButtonLink>
        </div>

        {/* Static preview of a plan (matches the Figma card). */}
        <div aria-hidden className="overflow-hidden rounded-2xl border bg-card shadow-xl">
          <div className="relative h-36">
            <Image src={photo("fashion-hall", 1200, 400)} alt="" fill sizes="50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            <p className="absolute bottom-3 left-5 font-heading text-2xl font-bold">Fashion Hall event</p>
          </div>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex gap-1 overflow-hidden rounded-lg bg-muted p-1 text-xs">
              {PLAN_TABS.map((tab, i) => (
                <span key={tab} className={`rounded-md px-3 py-1.5 whitespace-nowrap ${i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  {tab}
                </span>
              ))}
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p className="mb-3 text-sm font-semibold">Production requirements</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {REQUIREMENTS.map((r) => (
                  <div key={r.label} className="overflow-hidden rounded-lg bg-card">
                    <div className="relative aspect-[16/10]">
                      <Image src={photo(r.seed, 400, 250)} alt="" fill sizes="15vw" className="object-cover" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold">{r.label}</p>
                      <p className="text-[11px] text-muted-foreground">{r.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------- provider

export function BecomeProvider() {
  return (
    <section className="relative isolate overflow-hidden text-ink-foreground">
      <Image src={photo("provider-market", 1920, 1080)} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/65" />
      <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {["Location", "Gear", "Talent", "Creative service"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-gold" />
              {item}
            </li>
          ))}
        </ul>
        <h2 className="max-w-3xl text-5xl leading-[1.02] font-bold md:text-6xl">
          Have a resource <span className="text-gold">filmmakers</span> need?
        </h2>
        <p className="max-w-xl text-ink-foreground/80">
          Whether you own a studio, rent out cameras, manage a unique location or provide production
          talent, ArtMostSphere gives you a place to showcase what you offer.
        </p>
        <ButtonLink href="/list" size="lg">
          Become a provider
        </ButtonLink>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------- story

export function BiggerThanCamera() {
  return (
    <section className="bg-muted">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-80 md:min-h-[36rem]">
          <Image src={photo("crew-on-set", 1200, 1200)} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center gap-5 px-6 py-16 md:px-16">
          <Eyebrow>Why ArtMostSphere</Eyebrow>
          <h2 className="text-4xl font-bold md:text-5xl">Production is bigger than the camera.</h2>
          <p className="text-muted-foreground">
            A shoot lives or dies on the place, the kit and the people. We put all three in one catalog,
            ranked by distance to set, with a booking record both sides can see.
          </p>
          <ul className="flex flex-col gap-3 text-sm">
            {[
              "Verified listings published by our ops desk",
              "Distance-ranked results for every state and city",
              "Clear payment state and gear handoff records",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-primary">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- faq

const FAQ = [
  {
    q: "How does booking work?",
    a: "Pick your dates and send a request. The owner or creative confirms, then you agree payment. Every step is recorded on the booking.",
  },
  {
    q: "Is my payment protected?",
    a: "Payment state is tracked on each booking, but ArtMostSphere is not an insurer or a licensed escrow agent. Agree terms with the provider before the shoot.",
  },
  {
    q: "Which cities do you cover?",
    a: "We are starting in Nigeria — Lagos, Abuja, Port Harcourt and 17 more cities — with more of Africa to follow.",
  },
  {
    q: "How do I list my studio, gear or services?",
    a: "Create an account with the owner or creator role, then use “List something”. New listings go live after a quick review.",
  },
  {
    q: "What is a scout pin?",
    a: "Public places like beaches, parks and landmarks you can scout but not book through us. They show as dots on the map with access notes.",
  },
] as const;

export function Faq() {
  return (
    <section className="py-20 md:py-28">
      <Container className="grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-3">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-4xl font-bold md:text-5xl">Frequently asked questions</h2>
        </div>
        <div className="flex flex-col divide-y border-y">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {item.q}
                <span className="text-xl text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------- closing cta

export function ClosingCta() {
  return (
    <section className="py-20 md:py-28">
      <Container className="flex flex-col items-center gap-8 text-center">
        <h2 className="font-heading text-5xl leading-[0.95] font-extrabold tracking-tight uppercase md:text-8xl">
          Your next
          <br />
          production
          <br />
          <span className="text-primary">starts here.</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/planner" size="lg">
            Plan a shoot
          </ButtonLink>
          <ButtonLink href="/locations" size="lg" variant="outline">
            Browse locations
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

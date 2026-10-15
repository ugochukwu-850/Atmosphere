import { ChevronDown } from "lucide-react";

import { Container } from "@/components/ui/typography";

// Questions from the Figma frame. Only the first answer exists in the design;
// the rest describe the product as built — confirm the copy with the team.
const FAQ = [
  {
    q: "What is ArtMostSphere?",
    a: "ArtMostSphere is a production resource platform where you can discover locations, production equipment, cast and talent, and tools to help plan your next shoot.",
  },
  {
    q: "Can I rent equipment through ArtMostSphere?",
    a: "Yes. Browse cameras, lenses, lights and sound kit listed by owners and rental houses, pick your dates and send a rental request. The owner confirms availability and payment.",
  },
  {
    q: "Can I find actors and models?",
    a: "Yes. Cast & Talent lists actors, models, voice artists and crew with their day rates. You can request to hire them or post a casting call.",
  },
  {
    q: "Do I need to know what equipment I need?",
    a: "No. Describe your shoot in the Production Planner and it suggests the kit, shot types and people your brief needs, matched to what's available on the platform.",
  },
  {
    q: "Is ArtMostSphere only for filmmakers?",
    a: "No. It's built for film, photography, advertising, music, television and digital content teams of any size.",
  },
  {
    q: "Can I list my location or equipment?",
    a: "Yes. Create an account as an owner, then use List something. New listings are reviewed before they go live.",
  },
  {
    q: "What is the Production Planner?",
    a: "A tool that turns your idea into a production plan — locations, gear, talent, a timeline and a budget — with links to things you can actually book.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-4 py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <h2 className="text-4xl font-medium tracking-[-0.01em] md:text-5xl">
            Frequently asked
            <br />
            questions.
          </h2>
          <p className="text-lg text-charcoal-600 dark:text-muted-foreground">
            Still figuring out where to start?
            <br />
            Here&apos;s more about the production space we&apos;re building.
          </p>
        </div>
        <div className="flex flex-col border-t">
          {FAQ.map((item, i) => (
            <details
              key={item.q}
              open={i === 0}
              className="group border-b py-3"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-lg font-medium">
                {item.q}
                <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="max-w-[29rem] pt-2 pb-1 text-sm leading-relaxed text-charcoal-600 dark:text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

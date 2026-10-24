import { Container } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    n: "01",
    title: "Tell us what you're making",
    text: "Looking for a location? Need a camera? Casting for a commercial? Start with what you need.",
  },
  {
    n: "02",
    title: "Discover what fits",
    text: "Search locations, gear and talent around your requirements and where you're shooting.",
  },
  {
    n: "03",
    title: "Build your production",
    text: "Use the Planner to turn your creative idea into a practical production setup.",
  },
  {
    n: "04",
    title: "Connect and make it happen",
    text: "Contact the relevant owner, provider or talent and take the next step.",
  },
] as const;

/** "From idea to production, without the chaos." (Figma: Frame 34) */
export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative scroll-mt-4 overflow-hidden bg-ink py-20 text-white md:py-28"
    >
      <p
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-4 font-heading text-[clamp(5rem,11vw,165px)] leading-none font-bold text-white/15 select-none"
      >
        01-04
      </p>
      <Container className="relative flex flex-col gap-14">
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl font-medium tracking-[-0.01em] md:text-5xl">
            From idea to production, <br className="max-md:hidden" />
            without the chaos.
          </h2>
          <p className="max-w-[34rem] text-lg text-white/70">
            Start with the shoot you have in mind. Find what fits, make a plan,
            and connect with the people who can help.
          </p>
        </div>
        <ol className="grid border-t border-white/30 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className={cn(
                "flex flex-col gap-4 py-6 lg:pr-8",
                i > 0 && "lg:border-l lg:border-white/30 lg:pl-7",
              )}
            >
              <span className="font-heading text-[40px] leading-none font-semibold text-sand">
                {step.n}
              </span>
              <h3 className="mt-6 text-sm font-semibold">{step.title}</h3>
              <p className="max-w-[16rem] text-xs leading-relaxed text-white/85">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
        <p className="border-t border-white/30 pt-5 text-[15px] font-bold text-sand">
          Your idea is the starting point. ArtMostSphere helps you figure out
          what comes next.
        </p>
      </Container>
    </section>
  );
}

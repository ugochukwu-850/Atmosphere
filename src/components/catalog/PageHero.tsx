import type { ReactNode } from "react";

import { Container, Eyebrow } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/** Dark band that opens catalog pages ("Find a place that fits the frame."). */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-ink text-ink-foreground", className)}>
      <Container className="flex flex-col gap-6 py-14 md:py-20">
        <div className="flex max-w-2xl flex-col gap-3">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-4xl leading-[1.05] font-bold md:text-6xl">{title}</h1>
          {description && <p className="text-base text-ink-foreground/70 md:text-lg">{description}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
}

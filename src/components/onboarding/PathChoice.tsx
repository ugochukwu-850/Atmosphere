"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { ONBOARDING_PATHS, type OnboardingPath } from "@/lib/auth/onboarding";
import { cn } from "@/lib/utils";

// Rust card for viewers, olive (muted title) for providers, as in the frame.
const TONES: Record<OnboardingPath, { card: string; title: string }> = {
  viewer: {
    card: "border-primary text-primary hover:bg-primary/5",
    title: "text-foreground",
  },
  provider: {
    card: "border-olive text-olive hover:bg-olive/5",
    title: "text-secondary-text",
  },
};

/**
 * Step 1: each card is a submit button of a GET form, so picking one goes
 * straight to /register?as=<path>, without JS too. With JS it's a client-side
 * navigation (next/form would drop the clicked button's value).
 */
export function PathChoice() {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    if (!(submitter instanceof HTMLButtonElement)) return;
    event.preventDefault();
    router.push(`/register?as=${encodeURIComponent(submitter.value)}`);
  }

  return (
    <form
      action="/register"
      onSubmit={onSubmit}
      className="grid gap-4 sm:grid-cols-2 sm:gap-10"
    >
      {(Object.keys(ONBOARDING_PATHS) as OnboardingPath[]).map((path) => {
        const { title, description } = ONBOARDING_PATHS[path].choice;
        return (
          <button
            key={path}
            type="submit"
            name="as"
            value={path}
            className={cn(
              "flex flex-col items-start gap-12 rounded-[20px] border px-5 py-2.5 text-left transition-colors sm:gap-[89px]",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
              TONES[path].card,
            )}
          >
            {/* Radio-style marker (30px ring, 20px dot) in the card's colour. */}
            <span
              aria-hidden
              className="grid size-[30px] shrink-0 place-items-center rounded-full border border-current"
            >
              <span className="size-5 rounded-full bg-current" />
            </span>
            <span className="flex flex-col gap-2">
              <span
                className={cn(
                  "text-xl leading-normal font-semibold",
                  TONES[path].title,
                )}
              >
                {title}
              </span>
              <span className="text-base leading-normal text-secondary-text">
                {description}
              </span>
            </span>
          </button>
        );
      })}
    </form>
  );
}

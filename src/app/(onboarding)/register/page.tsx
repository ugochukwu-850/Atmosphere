import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  OnboardingHeading,
  OnboardingShell,
} from "@/components/onboarding/OnboardingShell";
import { PathChoice } from "@/components/onboarding/PathChoice";
import { ONBOARDING_PATHS, onboardingPath } from "@/lib/auth/onboarding";
import { param } from "@/lib/search-params";

export const metadata: Metadata = { title: "Create an account" };

/**
 * Sign-up: /register asks how you'll use the platform, /register?as=<path>
 * creates the account with that path's roles. After sign-up the user lands on
 * the home page signed in (the email-code step in Figma has no backend yet).
 */
export default function RegisterPage({ searchParams }: PageProps<"/register">) {
  return (
    <OnboardingShell>
      {/* ?as= is request-time data. */}
      <Suspense>
        <RegisterStep searchParams={searchParams} />
      </Suspense>
    </OnboardingShell>
  );
}

async function RegisterStep({
  searchParams,
}: Pick<PageProps<"/register">, "searchParams">) {
  const path = onboardingPath(param(await searchParams, "as"));

  if (!path) {
    return (
      <>
        <OnboardingHeading
          step={1}
          eyebrow="Join ArtMostSphere"
          title="How will you use ArtMostSphere?"
          description="Choose the path that fits you. You can use the platform to discover resources, offer them, or do both."
          className="mt-[38px]"
        />
        <div className="mt-10 md:mt-[99px]">
          <PathChoice />
        </div>
      </>
    );
  }

  const { roles, eyebrow, title, description } = ONBOARDING_PATHS[path];
  return (
    <>
      <OnboardingHeading
        step={2}
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div className="mt-10 md:mt-[65px]">
        <RegisterForm roles={roles} />
      </div>
      <p className="mt-16 pb-[11px] text-center text-[13px] font-light text-secondary-text xl:mt-auto xl:pt-8">
        By continuing you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}

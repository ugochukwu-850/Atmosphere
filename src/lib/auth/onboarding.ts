import type { ROLES } from "@/lib/validators/auth";

type OnboardingPathInfo = {
  /** Sent as `roles` on POST /v1/auth/register. */
  roles: readonly (typeof ROLES)[number][];
  /** Card on the path choice step. */
  choice: { title: string; description: string };
  /** Heading of the create-account step. */
  eyebrow: string;
  title: string;
  description: string;
};

/**
 * The two sign-up paths on the Figma "Onboarding" frame, keyed by `?as=` on
 * /register. More roles can be added later from the account page.
 */
export const ONBOARDING_PATHS = {
  viewer: {
    roles: ["renter"],
    choice: {
      title: "I’m here to find resources",
      description:
        "Explore locations, gear, cast and production planning as a viewer.",
    },
    eyebrow: "Viewer account / Create account",
    title: "Create your viewer account.",
    description:
      "Create an account to save your search, contact providers and request bookings.",
  },
  // No Figma frame for this path's form yet: copy mirrors the viewer one.
  provider: {
    roles: ["owner"],
    choice: {
      title: "I’m here to list or offer",
      description:
        "Showcase a location, gear, talent or creative services to productions.",
    },
    eyebrow: "Provider account / Create account",
    title: "Create your provider account.",
    description:
      "Create an account to list what you offer and answer booking requests.",
  },
} as const satisfies Record<string, OnboardingPathInfo>;

export type OnboardingPath = keyof typeof ONBOARDING_PATHS;

/** `?as=` value → a known path, or undefined (show the choice step). */
export function onboardingPath(
  value: string | undefined,
): OnboardingPath | undefined {
  return value && Object.hasOwn(ONBOARDING_PATHS, value)
    ? (value as OnboardingPath)
    : undefined;
}

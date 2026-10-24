import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthHeading } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      <AuthHeading
        eyebrow="Welcome back"
        title="Sign in to your production desk."
        description="Book spaces, rent kit and hire talent — pick up where you left off."
      />
      {/* useSearchParams (for ?next=) needs a Suspense boundary. */}
      <Suspense>
        <LoginForm />
      </Suspense>
      {/* The session is request-time data, so the check streams in. */}
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
    </div>
  );
}

/** Already signed in: skip the form and open the dashboard. */
async function RedirectIfSignedIn() {
  // getCurrentUser validates the token, so an expired cookie still sees the form.
  if (await getCurrentUser()) redirect("/dashboard");
  return null;
}

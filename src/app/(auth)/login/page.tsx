import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthHeading } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

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
    </div>
  );
}

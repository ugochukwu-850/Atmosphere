import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to book spaces, rent kit and hire crew."
    >
      {/* useSearchParams (for ?next=) needs a Suspense boundary. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}

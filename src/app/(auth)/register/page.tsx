import type { Metadata } from "next";

import { AuthHeading } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-8">
      <AuthHeading
        eyebrow="Join ArtMostSphere"
        title="Create your account."
        description="Explore the catalog for free. You can add more roles later from your account."
      />
      <RegisterForm />
    </div>
  );
}

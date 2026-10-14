import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Join the production desk"
      description="Pick every role that fits. You can add more later from your account."
    >
      <RegisterForm />
    </AuthCard>
  );
}

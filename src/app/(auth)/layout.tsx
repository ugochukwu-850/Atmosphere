import { AuthShell } from "@/components/auth/AuthShell";

// Focused split screen: no site header or footer.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthShell>{children}</AuthShell>;
}

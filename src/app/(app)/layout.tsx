// Signed-out visitors are redirected to /login by src/proxy.ts.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

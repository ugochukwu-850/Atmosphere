import { Suspense } from "react";

import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { UserMenu } from "@/components/layout/UserMenu";

// Signed-out visitors are redirected to /login by src/proxy.ts.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardFrame
      account={
        <Suspense
          fallback={<div className="size-10 rounded-full bg-[#d9d9d9]" />}
        >
          <UserMenu />
        </Suspense>
      }
    >
      {children}
    </DashboardFrame>
  );
}

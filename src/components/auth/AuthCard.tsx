import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/typography";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex justify-center px-4 py-16">
      <Card className="flex w-full max-w-md flex-col gap-6 p-8">
        <div className="flex flex-col gap-2">
          <Eyebrow>Production desk</Eyebrow>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </Card>
    </div>
  );
}

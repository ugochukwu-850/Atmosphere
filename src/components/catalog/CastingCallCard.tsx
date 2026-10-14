import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CastingCall } from "@/lib/data/types";
import { formatDate, titleCase } from "@/lib/format";

import { placeLabel } from "./place";

export function CastingCallCard({
  call,
  children,
}: {
  call: CastingCall;
  children?: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="primary">{titleCase(call.roleNeeded)}</Badge>
        <span>{placeLabel(call)}</span>
        {call.shootDate && <span>· Shoots {formatDate(call.shootDate)}</span>}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-heading text-xl font-semibold">{call.title}</h3>
        <p className="text-sm text-muted-foreground">{call.brief}</p>
      </div>
      {(call.owner || call.applications !== undefined) && (
        <p className="text-xs text-muted-foreground">
          {call.owner && `Posted by ${call.owner.name}`}
          {call.applications !== undefined &&
            ` · ${call.applications} interested`}
        </p>
      )}
      {children}
    </Card>
  );
}

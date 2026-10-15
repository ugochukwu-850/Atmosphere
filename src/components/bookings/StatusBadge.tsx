import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { statusMeta } from "./status";

/**
 * Booking status on the card badge: olive (the Scout-only badge) when the
 * booking is going ahead, warm sand while someone needs to act, muted after.
 */
export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const { label, tone } = statusMeta(status);
  return (
    <Badge
      variant={tone === "olive" ? "scout" : "neutral"}
      className={cn(tone === "sand" && "bg-sand text-charcoal", className)}
    >
      {label}
    </Badge>
  );
}

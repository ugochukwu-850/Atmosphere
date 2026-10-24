import Link from "next/link";

import { cn } from "@/lib/utils";

/** "Artmostsphere" wordmark; rust in the site header, white on the hero photo. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-heading text-xl font-semibold tracking-tight text-primary",
        className,
      )}
    >
      Artmostsphere
    </Link>
  );
}

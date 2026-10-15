"use client";

import type { ListingKind } from "@/lib/validators/listing";

import { KIND_COPY } from "./copy";

/** Radio cards for the listing kind, in the style of the sign-up role cards. */
export function KindPicker({
  kinds,
  value,
  onChange,
  error,
}: {
  kinds: ListingKind[];
  value: ListingKind;
  onChange: (kind: ListingKind) => void;
  error?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">What are you listing?</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {kinds.map((kind) => (
          <label
            key={kind}
            className="group relative flex cursor-pointer items-start gap-4 rounded-md border bg-background p-4 transition-colors hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40"
          >
            <input
              type="radio"
              name="kind"
              value={kind}
              checked={value === kind}
              onChange={() => onChange(kind)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-charcoal/25 peer-checked:border-primary dark:border-white/30"
            >
              <span className="size-2.5 rounded-full bg-primary opacity-0 group-has-[:checked]:opacity-100" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">
                {KIND_COPY[kind].label}
              </span>
              <span className="text-xs text-muted-foreground">
                {KIND_COPY[kind].blurb}
              </span>
            </span>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </fieldset>
  );
}

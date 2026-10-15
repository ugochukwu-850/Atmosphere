"use client";

import { ChevronDown } from "lucide-react";

/** Category filter as a GET form that submits on change (works without JS via the button). */
export function CategorySelect({
  action,
  value,
  options,
  keep,
}: {
  action: string;
  value?: string;
  options: { value: string; label: string }[];
  keep: Record<string, string | undefined>;
}) {
  return (
    <form action={action} className="relative">
      {Object.entries(keep).map(([name, v]) =>
        v ? <input key={name} type="hidden" name={name} value={v} /> : null,
      )}
      <label htmlFor="category" className="sr-only">
        Category
      </label>
      <select
        id="category"
        name="category"
        defaultValue={value ?? ""}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-9 appearance-none rounded-xs border bg-background pr-9 pl-3 text-[13px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2"
      />
      <noscript>
        <button type="submit">Apply</button>
      </noscript>
    </form>
  );
}

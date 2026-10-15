"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Field, Input, Select } from "@/components/ui/form";
import { OTHER_CHOICE, type Choice } from "@/lib/validators/fields";

/**
 * Select of suggestions plus "Other…", which reveals a text box: the API takes
 * free text. Posts `<name>Choice` and `<name>Other`; `chosen()` reads them.
 */
export function ChoiceField({
  name,
  label,
  options,
  defaultValue = "",
  placeholder,
  otherPlaceholder,
  error,
}: {
  name: string;
  label: string;
  options: Choice[];
  /** The final value (a suggestion or free text). */
  defaultValue?: string;
  /** Disabled first option, e.g. "Choose a category". Omit to start on a suggestion. */
  placeholder?: string;
  otherPlaceholder: string;
  error?: string;
}) {
  const known = options.some((o) => o.value === defaultValue);
  const initial = known || !defaultValue ? defaultValue : OTHER_CHOICE;
  const [choice, setChoice] = useState(initial);
  const id = `${name}-choice`;

  return (
    <Field label={label} htmlFor={id} error={error}>
      <div className="relative">
        <Select
          id={id}
          name={`${name}Choice`}
          defaultValue={initial}
          onChange={(e) => setChoice(e.target.value)}
          aria-invalid={Boolean(error) && choice !== OTHER_CHOICE}
          required
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          <option value={OTHER_CHOICE}>Other…</option>
        </Select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      {choice === OTHER_CHOICE && (
        <Input
          name={`${name}Other`}
          aria-label={`${label}: other`}
          placeholder={otherPlaceholder}
          defaultValue={known ? "" : defaultValue}
          aria-invalid={Boolean(error)}
          maxLength={80}
          required
        />
      )}
    </Field>
  );
}

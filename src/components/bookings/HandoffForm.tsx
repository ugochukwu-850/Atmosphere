"use client";

import { useActionState, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/workspace/WorkspacePage";
import {
  recordHandoffAction,
  type HandoffValues,
} from "@/lib/bookings/actions";
import type { HandoffPhase } from "@/lib/data/bookings";
import type { ActionState } from "@/lib/forms";
import {
  HANDOFF_PHOTO_MAX_BYTES,
  HANDOFF_PHOTO_TYPES,
} from "@/lib/validators/booking";

import { HANDOFF_CHECKS, HANDOFF_PHASES } from "./handoff";

const PHOTO_TYPES: readonly string[] = HANDOFF_PHOTO_TYPES;

/**
 * Pickup / return checklist for gear, posted as multipart form data with an
 * optional photo. Fields refill from the returned values after an error.
 */
export function HandoffForm({
  bookingId,
  defaultPhase,
}: {
  bookingId: string;
  defaultPhase: HandoffPhase;
}) {
  const [state, action, pending] = useActionState<
    ActionState<HandoffValues>,
    FormData
  >(recordHandoffAction.bind(null, bookingId), {});
  // Checked in the browser too: an oversized upload would fail before the
  // action runs, with no message to show.
  const [photoError, setPhotoError] = useState<string>();
  const values = state.values;
  const phase = values?.phase ?? defaultPhase;
  const err = (key: string) => state.fieldErrors?.[key]?.[0];

  function checkPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    let problem: string | undefined;
    if (file && !PHOTO_TYPES.includes(file.type))
      problem = "Use a JPEG, PNG, WebP or GIF photo";
    else if (file && file.size > HANDOFF_PHOTO_MAX_BYTES)
      problem = "Photo must be 8MB or smaller";
    if (problem) event.target.value = "";
    setPhotoError(problem);
  }

  return (
    <form action={action} className="flex flex-col gap-7">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-xs font-medium text-muted-foreground">
          Which handoff is this?
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {HANDOFF_PHASES.map((p) => (
            <label
              key={p.value}
              className="flex cursor-pointer items-start gap-3 rounded-sm border border-transparent bg-muted/60 p-4 has-checked:border-primary has-checked:bg-background"
            >
              <input
                type="radio"
                name="phase"
                value={p.value}
                defaultChecked={phase === p.value}
                required
                className="mt-0.5 size-4 accent-primary"
              />
              <span className="flex flex-col gap-1">
                <span className="text-sm font-semibold">{p.label}</span>
                <span className="text-xs text-muted-foreground">{p.hint}</span>
              </span>
            </label>
          ))}
        </div>
        {err("phase") && (
          <p className="text-xs text-destructive">{err("phase")}</p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-3 text-xs font-medium text-muted-foreground">
          Checked together
        </legend>
        {HANDOFF_CHECKS.map((check) => (
          <label
            key={check.name}
            className="flex cursor-pointer items-start gap-3"
          >
            <input
              type="checkbox"
              name={check.name}
              defaultChecked={values?.[check.name] ?? false}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm">{check.label}</span>
              <span className="text-xs text-muted-foreground">
                {check.hint}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      <Field
        label="Notes"
        htmlFor="handoff-notes"
        error={err("notes")}
        hint="Scratches, missing parts, anything to compare at return."
      >
        <Textarea
          id="handoff-notes"
          name="notes"
          rows={3}
          maxLength={2000}
          defaultValue={values?.notes}
        />
      </Field>

      <Field
        label="Photo (optional)"
        htmlFor="handoff-photo"
        error={photoError ?? err("photo")}
        hint="JPEG, PNG, WebP or GIF, up to 8MB."
      >
        <Input
          id="handoff-photo"
          name="photo"
          type="file"
          accept={HANDOFF_PHOTO_TYPES.join(",")}
          onChange={checkPhoto}
          className="h-auto py-2.5 file:mr-4 file:rounded-xs file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:text-secondary-foreground"
        />
      </Field>

      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.ok && <Notice tone="success">Handoff report saved.</Notice>}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-[56px] self-start px-10 text-sm font-normal"
      >
        {pending ? "Saving…" : "Save handoff report"}
      </Button>
    </form>
  );
}

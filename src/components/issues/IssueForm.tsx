"use client";

import { useActionState, useId } from "react";

import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/workspace/WorkspacePage";
import type { ActionState } from "@/lib/forms";
import { reportIssueAction } from "@/lib/issues/actions";

const THANKS = "Thanks. Your report reached the team.";

/**
 * "Report an issue": a message posted to POST /v1/issues with the path it
 * was sent from. `footer` is the compact version for the black footer.
 */
export function IssueForm({
  variant = "page",
}: {
  variant?: "page" | "footer";
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    reportIssueAction,
    {},
  );
  const id = useId();
  const error = state.fieldErrors?.body?.[0];

  // Read the path at submit time so the form stays prerenderable.
  const submit = (formData: FormData) => {
    formData.set("page", window.location.pathname);
    action(formData);
  };

  const textarea = (className: string, rows: number) => (
    <Textarea
      id={id}
      name="body"
      rows={rows}
      maxLength={1800}
      required
      defaultValue={state.values?.body}
      aria-invalid={Boolean(error)}
      className={className}
      placeholder="What broke?"
    />
  );
  const status = (
    <>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.ok && !pending && <Notice tone="success">{THANKS}</Notice>}
    </>
  );

  if (variant === "footer") {
    // The footer is black in both themes, so the form takes the dark tokens.
    return (
      <form
        action={submit}
        data-theme="dark"
        className="flex flex-col gap-3 text-foreground"
        noValidate
      >
        <label htmlFor={id} className="text-[15px] font-semibold uppercase">
          Report an issue
        </label>
        {textarea("min-h-20", 3)}
        {error && <p className="text-xs text-destructive">{error}</p>}
        {status}
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={pending}
          className="self-start"
        >
          {pending ? "Sending…" : "Send"}
        </Button>
      </form>
    );
  }

  return (
    <form action={submit} className="flex flex-col gap-5" noValidate>
      <Field
        label="What happened?"
        htmlFor={id}
        error={error}
        hint="Say what you were trying to do and what went wrong. We add the page you're on."
      >
        {textarea("min-h-40", 6)}
      </Field>
      {status}
      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Sending…" : "Send report"}
      </Button>
    </form>
  );
}

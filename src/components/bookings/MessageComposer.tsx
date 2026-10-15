"use client";

import { Send } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/workspace/WorkspacePage";
import { sendMessageAction, type MessageValues } from "@/lib/bookings/actions";
import type { ActionState } from "@/lib/forms";

/** Message box under the thread. React resets it after each send. */
export function MessageComposer({
  bookingId,
  recipient,
}: {
  bookingId: string;
  recipient?: string;
}) {
  const [state, action, pending] = useActionState<
    ActionState<MessageValues>,
    FormData
  >(sendMessageAction.bind(null, bookingId), {});

  return (
    <form action={action} className="flex flex-col gap-3 border-t pt-6">
      <Field
        label={recipient ? `Message ${recipient}` : "Message"}
        htmlFor="message-body"
        error={state.fieldErrors?.body?.[0]}
      >
        <Textarea
          id="message-body"
          name="body"
          rows={3}
          maxLength={2000}
          required
          // Refill after a failed send (React clears the form either way).
          defaultValue={state.values?.body}
          placeholder="Call times, crew size, pickup details…"
          aria-invalid={Boolean(state.fieldErrors?.body)}
        />
      </Field>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-12 self-end px-8 text-sm font-normal"
      >
        <Send aria-hidden className="size-4" />
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

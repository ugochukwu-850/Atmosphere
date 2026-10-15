"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Notice } from "@/components/workspace/WorkspacePage";
import {
  acceptBookingAction,
  declineBookingAction,
  markPaidAction,
} from "@/lib/bookings/actions";
import type { ActionState } from "@/lib/forms";

// Same full-width 66px button as "Request to book" on the price panel.
const BIG = "h-[66px] w-full rounded-sm text-[15px] font-normal";

/** Accept / Decline for a `requested` booking (owner only). */
export function RespondActions({
  bookingId,
  renterName,
}: {
  bookingId: string;
  renterName: string;
}) {
  const [accepted, accept, accepting] = useActionState<ActionState, FormData>(
    acceptBookingAction.bind(null, bookingId),
    {},
  );
  const [declined, decline, declining] = useActionState<ActionState, FormData>(
    declineBookingAction.bind(null, bookingId),
    {},
  );
  const [confirming, setConfirming] = useState(false);
  const busy = accepting || declining;

  return (
    <div className="flex flex-col gap-3">
      <form action={accept}>
        <Button type="submit" size="lg" disabled={busy} className={BIG}>
          {accepting ? "Accepting…" : "Accept request"}
        </Button>
      </form>
      <Button
        variant="outline"
        size="lg"
        disabled={busy}
        onClick={() => setConfirming(true)}
        className="h-12 w-full font-normal"
      >
        Decline
      </Button>
      {accepted.error && <Notice tone="error">{accepted.error}</Notice>}

      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        eyebrow="Before you decline"
        title="Decline this request?"
      >
        <p className="max-w-[36rem] text-lg text-charcoal-600 dark:text-muted-foreground">
          {renterName} will see that you declined. The dates stay open for other
          requests. You can&apos;t undo this.
        </p>
        {declined.error && <Notice tone="error">{declined.error}</Notice>}
        <form action={decline} className="mt-2 flex flex-wrap gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={declining}
            className="h-[56px] px-10 text-sm font-normal"
          >
            {declining ? "Declining…" : "Decline request"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setConfirming(false)}
            className="h-[56px] px-8 text-sm font-normal"
          >
            Keep it
          </Button>
        </form>
      </Dialog>
    </div>
  );
}

/** Mark paid for an `awaiting_funds` booking (owner or admin), after a confirm. */
export function MarkPaidAction({
  bookingId,
  renterName,
}: {
  bookingId: string;
  renterName: string;
}) {
  const [state, markPaid, pending] = useActionState<ActionState, FormData>(
    markPaidAction.bind(null, bookingId),
    {},
  );
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <Button size="lg" onClick={() => setConfirming(true)} className={BIG}>
        Mark as paid
      </Button>
      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        eyebrow="Confirm payment"
        title="Mark this booking paid?"
      >
        <p className="max-w-[36rem] text-lg text-charcoal-600 dark:text-muted-foreground">
          Only do this once {renterName}&apos;s payment has reached you. It
          confirms the booking and records the payment.
        </p>
        {state.error && <Notice tone="error">{state.error}</Notice>}
        <form action={markPaid} className="mt-2 flex flex-wrap gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="h-[56px] px-10 text-sm font-normal"
          >
            {pending ? "Saving…" : "Yes, mark paid"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setConfirming(false)}
            className="h-[56px] px-8 text-sm font-normal"
          >
            Not yet
          </Button>
        </form>
      </Dialog>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import { requestBookingAction, type BookingFormState } from "@/lib/bookings/actions";
import { formatNgn } from "@/lib/format";
import { bookingDays } from "@/lib/validators/booking";

/**
 * Sticky price card with the date request form. Signed-out visitors get the
 * "Sign in to request booking" dialog instead of submitting (Figma: Location Detail 2).
 */
export function RequestCard({
  listingId,
  dayRateNgn,
  verb,
  noteLabel,
  signedIn,
  disclaimer,
}: {
  listingId: string;
  dayRateNgn: number;
  verb: string;
  noteLabel: string;
  signedIn: boolean;
  disclaimer?: string;
}) {
  const pathname = usePathname();
  const [gateOpen, setGateOpen] = useState(false);
  const [dates, setDates] = useState({ start: "", end: "" });
  const [state, action, pending] = useActionState<BookingFormState, FormData>(
    requestBookingAction.bind(null, listingId),
    {},
  );

  const days = dates.start && dates.end ? bookingDays(dates.start, dates.end) : 0;
  const today = new Date().toISOString().slice(0, 10);
  const err = (key: string) => state.fieldErrors?.[key]?.[0];

  if (state.ok) {
    return (
      <Card className="flex flex-col gap-3 p-6">
        <p className="font-heading text-xl font-semibold">Request sent</p>
        <p className="text-sm text-muted-foreground">
          The owner confirms dates and payment. Track it in your bookings.
        </p>
        <ButtonLink href={state.bookingId ? `/bookings/${state.bookingId}` : "/bookings"} variant="outline">
          View booking
        </ButtonLink>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-5 p-6">
      <p>
        <span className="font-heading text-2xl font-bold">{formatNgn(dayRateNgn)}</span>
        <span className="text-sm text-muted-foreground"> / day</span>
      </p>
      <form
        action={action}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start" htmlFor="startDate" error={err("startDate")}>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              min={today}
              required
              value={dates.start}
              onChange={(e) => setDates((d) => ({ ...d, start: e.target.value }))}
            />
          </Field>
          <Field label="End" htmlFor="endDate" error={err("endDate")}>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              min={dates.start || today}
              required
              value={dates.end}
              onChange={(e) => setDates((d) => ({ ...d, end: e.target.value }))}
            />
          </Field>
        </div>
        <Field label={noteLabel} htmlFor="note" error={err("note")}>
          <Textarea id="note" name="note" rows={3} placeholder="Crew size, call times, anything they should know" />
        </Field>
        {days > 0 && (
          <div className="flex items-center justify-between border-t pt-4 text-sm">
            <span className="text-muted-foreground">
              {formatNgn(dayRateNgn)} × {days} day{days === 1 ? "" : "s"}
            </span>
            <span className="font-semibold">{formatNgn(dayRateNgn * days)}</span>
          </div>
        )}
        {state.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}
        {signedIn ? (
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Sending…" : verb}
          </Button>
        ) : (
          // Signed out: skip native date validation and go straight to the sign-in gate.
          <Button size="lg" onClick={() => setGateOpen(true)}>
            {verb}
          </Button>
        )}
        {disclaimer && <p className="text-xs text-muted-foreground">{disclaimer}</p>}
      </form>

      <Dialog open={gateOpen} onClose={() => setGateOpen(false)} title={`Sign in to ${verb.toLowerCase()}`}>
        <p className="text-sm text-muted-foreground">
          You need an account to send requests. Your dates stay on this page.
        </p>
        <div className="flex flex-col gap-2">
          <ButtonLink href={`/login?next=${encodeURIComponent(pathname)}`}>Sign in</ButtonLink>
          <Link
            href="/register"
            className="text-center text-sm font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </div>
      </Dialog>
    </Card>
  );
}

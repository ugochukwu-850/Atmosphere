"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useState, type ReactNode } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import {
  requestBookingAction,
  type BookingFormState,
} from "@/lib/bookings/actions";
import { formatNgn } from "@/lib/format";
import { cn } from "@/lib/utils";
import { bookingDays } from "@/lib/validators/booking";

/** Price panel shell (Figma: Location Detail, right column). */
export function PricePanel({
  amountNgn,
  unit,
  status,
  note,
  children,
}: {
  amountNgn: number;
  unit: string;
  status: { label: string; tone: "olive" | "sand" };
  note: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 rounded-xl bg-card p-6 lg:sticky lg:top-6">
      <p className="rounded-sm bg-white py-4 text-center dark:bg-muted">
        <span className="font-heading text-[34px] font-bold">
          {formatNgn(amountNgn)}
        </span>
        <span className="text-sm">{unit}</span>
      </p>
      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-2 text-sm">
          <span
            aria-hidden
            className={cn(
              "size-2.5 rounded-full",
              status.tone === "olive" ? "bg-olive" : "bg-sand",
            )}
          />
          {status.label}
        </p>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {note}
        </p>
      </div>
      {children}
    </div>
  );
}

/**
 * "Request to book" + its dialog. Signed out: the "Sign in to request this
 * booking." modal from Location Detail 2. Signed in: dates and a note, posted
 * to POST /v1/bookings. `?request=1` on the page opens it straight away.
 */
export function RequestButton({
  listingId,
  dayRateNgn,
  verb,
  noun,
  signedIn,
  autoOpen,
}: {
  listingId: string;
  dayRateNgn: number;
  /** "Request to book", "Request rental", "Request to hire". */
  verb: string;
  /** "booking", "rental", "hire". */
  noun: string;
  signedIn: boolean;
  autoOpen?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(Boolean(autoOpen));
  const [dates, setDates] = useState({ start: "", end: "" });
  const [state, action, pending] = useActionState<BookingFormState, FormData>(
    requestBookingAction.bind(null, listingId),
    {},
  );
  const days =
    dates.start && dates.end ? bookingDays(dates.start, dates.end) : 0;
  const today = new Date().toISOString().slice(0, 10);
  const err = (key: string) => state.fieldErrors?.[key]?.[0];

  return (
    <>
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="h-[66px] w-full rounded-sm text-[15px] font-normal"
      >
        {verb}
      </Button>

      {!signedIn ? (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          eyebrow="Your next step"
          title={`Sign in to request this ${noun}.`}
        >
          <p className="max-w-[36rem] text-lg text-charcoal-600 dark:text-muted-foreground">
            You can explore this entire listing without signing in. Sign in when
            you are ready to request a {noun}.
          </p>
          <ButtonLink
            href={`/login?next=${encodeURIComponent(`${pathname}?request=1`)}`}
            size="lg"
            className="mt-4 h-[64px] w-[282px] text-sm font-normal"
          >
            Sign in or create an account
          </ButtonLink>
        </Dialog>
      ) : (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          eyebrow="Your next step"
          title={state.ok ? "Request sent." : `Request this ${noun}.`}
        >
          {state.ok ? (
            <>
              <p className="text-lg text-charcoal-600 dark:text-muted-foreground">
                The provider confirms dates and payment. Follow it, and message
                them, from your bookings.
              </p>
              <Link
                href={
                  state.bookingId ? `/bookings/${state.bookingId}` : "/bookings"
                }
                className="mt-2 text-sm font-semibold text-primary hover:underline"
              >
                View booking →
              </Link>
            </>
          ) : (
            <form action={action} className="flex flex-col gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Start date"
                  htmlFor="startDate"
                  error={err("startDate")}
                >
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    min={today}
                    required
                    value={dates.start}
                    onChange={(e) =>
                      setDates((d) => ({ ...d, start: e.target.value }))
                    }
                    className="h-12 bg-white dark:bg-muted"
                  />
                </Field>
                <Field
                  label="End date"
                  htmlFor="endDate"
                  error={err("endDate")}
                >
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    min={dates.start || today}
                    required
                    value={dates.end}
                    onChange={(e) =>
                      setDates((d) => ({ ...d, end: e.target.value }))
                    }
                    className="h-12 bg-white dark:bg-muted"
                  />
                </Field>
              </div>
              <Field
                label="Note to the provider"
                htmlFor="note"
                error={err("note")}
              >
                <Textarea
                  id="note"
                  name="note"
                  rows={3}
                  placeholder="Crew size, call times, anything they should know"
                  className="bg-white dark:bg-muted"
                />
              </Field>
              {days > 0 && (
                <p className="flex items-center justify-between border-t border-charcoal/10 pt-4 text-sm">
                  <span className="text-muted-foreground">
                    {formatNgn(dayRateNgn)} × {days} day{days === 1 ? "" : "s"}
                  </span>
                  <span className="font-semibold">
                    {formatNgn(dayRateNgn * days)}
                  </span>
                </p>
              )}
              {state.error && (
                <p role="alert" className="text-sm text-destructive">
                  {state.error}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={pending}
                className="h-[56px] self-start px-10 text-sm font-normal"
              >
                {pending ? "Sending…" : "Send request"}
              </Button>
              <p className="text-xs text-muted-foreground">
                You won&apos;t be charged now. Payment is agreed with the
                provider.
              </p>
            </form>
          )}
        </Dialog>
      )}
    </>
  );
}

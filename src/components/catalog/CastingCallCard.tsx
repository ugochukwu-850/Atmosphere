"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/form";
import {
  expressInterestAction,
  type InterestState,
} from "@/lib/casting/actions";
import type { CastingCall } from "@/lib/data/types";
import { formatDate, titleCase } from "@/lib/format";

import { cardButton } from "./CatalogCard";

/** Casting call card (no photo) in the Location Search card style. */
export function CastingCallCard({
  call,
  signedIn,
}: {
  call: CastingCall;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<InterestState, FormData>(
    expressInterestAction.bind(null, call.id),
    {},
  );

  return (
    <article className="flex flex-col rounded-xl border border-sand/40 bg-card p-6 dark:border-border">
      <div className="flex items-center justify-between gap-3">
        <Badge variant={call.status === "open" ? "scout" : "neutral"}>
          {call.status === "open" ? "Open" : titleCase(call.status)}
        </Badge>
        {call.applications !== undefined && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            {call.applications} interested
          </span>
        )}
      </div>
      <p className="mt-6 text-[10px] leading-none font-extrabold tracking-[0.04em] text-primary uppercase">
        {[call.roleNeeded, call.neighborhood].filter(Boolean).join(" / ")}
      </p>
      <h3 className="mt-2 font-heading text-[22px] leading-tight">
        {call.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-[13px] leading-snug text-muted-foreground">
        {call.brief}
      </p>
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {call.shootDate && (
          <li className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            Shoots {formatDate(call.shootDate)}
          </li>
        )}
        {(call.neighborhood || call.city) && (
          <li className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {[call.neighborhood, call.city].filter(Boolean).join(", ")}
          </li>
        )}
      </ul>
      <div className="mt-auto flex items-end justify-between gap-3 pt-7">
        <p className="text-xs text-muted-foreground">
          {call.owner ? `Posted by ${call.owner.name}` : ""}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cardButton("secondary")}
        >
          {state.ok ? "Interest sent" : "Express interest"}
        </button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        eyebrow={signedIn ? "Express interest" : "Your next step"}
        title={signedIn ? call.title : "Sign in to express interest."}
      >
        {!signedIn ? (
          <>
            <p className="text-base text-charcoal-600 dark:text-muted-foreground">
              You can browse every casting call without signing in. Sign in when
              you&apos;re ready to put yourself forward.
            </p>
            <Link
              href="/login?next=/cast/calls"
              className={`${cardButton("primary")} h-[52px] self-start px-8 text-sm`}
            >
              Sign in or create an account
            </Link>
          </>
        ) : state.ok ? (
          <p className="text-base">
            Sent. {call.owner?.name ?? "The poster"} will see your message with
            your profile.
          </p>
        ) : (
          <form action={action} className="flex flex-col gap-4">
            <label htmlFor={`msg-${call.id}`} className="text-sm font-medium">
              Why you fit this role
            </label>
            <Textarea
              id={`msg-${call.id}`}
              name="message"
              rows={5}
              defaultValue={state.message}
              placeholder="Your experience, look, availability on the shoot date…"
              className="bg-white dark:bg-muted"
            />
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={pending}
              className="h-[52px] self-start px-8"
            >
              {pending ? "Sending…" : "Send interest"}
            </Button>
          </form>
        )}
      </Dialog>
    </article>
  );
}

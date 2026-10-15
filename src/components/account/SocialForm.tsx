"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Notice } from "@/components/workspace/WorkspacePage";
import { updateSocialsAction } from "@/lib/account/actions";
import type { Person } from "@/lib/data/types";
import type { ActionState } from "@/lib/forms";
import { PLATFORM_LABEL, SOCIAL_PLATFORMS } from "@/lib/validators/account";

const radio = "size-4 shrink-0 accent-primary";
const radioLabel =
  "inline-flex cursor-pointer items-center gap-2 self-start text-xs text-muted-foreground";

/**
 * Social panel: one handle per platform and a single "show feed" choice.
 * Saving replaces the whole list (PUT /v1/users/me/social).
 */
export function SocialForm({ socials }: { socials: Person["socials"] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateSocialsAction,
    {},
  );
  const err = (key: string) => state.fieldErrors?.[key]?.[0];
  const handle = (platform: string) =>
    state.values?.[platform] ??
    socials.find((s) => s.platform === platform)?.handle ??
    "";
  const feed =
    state.values?.showFeed ?? socials.find((s) => s.showFeed)?.platform ?? "";

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        {SOCIAL_PLATFORMS.map((platform) => {
          const label = PLATFORM_LABEL[platform];
          return (
            <Field
              key={platform}
              label={label}
              htmlFor={`social-${platform}`}
              error={err(platform)}
            >
              <Input
                id={`social-${platform}`}
                name={platform}
                placeholder="yourhandle"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                defaultValue={handle(platform)}
                aria-invalid={Boolean(err(platform))}
              />
              <label className={radioLabel}>
                <input
                  type="radio"
                  name="showFeed"
                  value={platform}
                  defaultChecked={feed === platform}
                  className={radio}
                />
                Show {label} feed
              </label>
            </Field>
          );
        })}
      </div>
      <label className={radioLabel}>
        <input
          type="radio"
          name="showFeed"
          value=""
          defaultChecked={!feed}
          className={radio}
        />
        Don&apos;t show a feed on my profile
      </label>

      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.ok && !pending && (
        <Notice tone="success">Social accounts saved.</Notice>
      )}
      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save social accounts"}
      </Button>
    </form>
  );
}

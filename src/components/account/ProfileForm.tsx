"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/workspace/WorkspacePage";
import { updateProfileAction } from "@/lib/account/actions";
import type { ActionState } from "@/lib/forms";
import type { ProfileInput } from "@/lib/validators/account";

/** Profile panel: name, phone, neighborhood, specialties and bio. */
export function ProfileForm({
  email,
  defaults,
}: {
  email: string;
  defaults: ProfileInput;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateProfileAction,
    {},
  );
  const err = (key: string) => state.fieldErrors?.[key]?.[0];
  // Refill from what was submitted; React resets the form after the action.
  const value = (key: keyof ProfileInput) =>
    state.values?.[key] ?? defaults[key];

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" error={err("name")}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            defaultValue={value("name")}
            aria-invalid={Boolean(err("name"))}
            required
          />
        </Field>
        <Field
          label="Email"
          htmlFor="email"
          hint="Your sign-in email can't be changed here."
        >
          <Input id="email" type="email" value={email} disabled readOnly />
        </Field>
        <Field label="Phone" htmlFor="phone" error={err("phone")}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+234 800 000 0000"
            defaultValue={value("phone")}
            aria-invalid={Boolean(err("phone"))}
            required
          />
        </Field>
        <Field
          label="Neighborhood"
          htmlFor="neighborhood"
          error={err("neighborhood")}
        >
          <Input
            id="neighborhood"
            name="neighborhood"
            placeholder="Yaba"
            defaultValue={value("neighborhood")}
            aria-invalid={Boolean(err("neighborhood"))}
          />
        </Field>
      </div>
      <Field
        label="Specialties"
        htmlFor="specialties"
        error={err("specialties")}
        hint="Separate with commas, e.g. sound mixer, boom operator."
      >
        <Input
          id="specialties"
          name="specialties"
          placeholder="Director, colourist, drone pilot"
          defaultValue={value("specialties")}
          aria-invalid={Boolean(err("specialties"))}
        />
      </Field>
      <Field
        label="Bio"
        htmlFor="bio"
        error={err("bio")}
        hint="What you do and the kind of work you take on. Up to 2,000 characters."
      >
        <Textarea
          id="bio"
          name="bio"
          rows={5}
          maxLength={2000}
          defaultValue={value("bio")}
          aria-invalid={Boolean(err("bio"))}
          className="min-h-36"
        />
      </Field>

      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.ok && !pending && <Notice tone="success">Profile saved.</Notice>}
      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}

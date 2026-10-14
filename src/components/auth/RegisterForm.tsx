"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { registerAction, type FormState } from "@/lib/auth/actions";
import { ROLE_OPTIONS, ROLES } from "@/lib/validators/auth";

import { FormAlert } from "./AuthShell";
import { PasswordInput } from "./PasswordInput";

export function RegisterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    registerAction,
    {},
  );
  const err = (key: string) => state.fieldErrors?.[key]?.[0];
  const value = (key: string) => state.values?.[key] as string | undefined;
  const chosenRoles = (state.values?.roles as string[] | undefined) ?? [
    "renter",
  ];

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <Field label="Full name" htmlFor="name" error={err("name")}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Ada Okonkwo"
          defaultValue={value("name")}
          aria-invalid={Boolean(err("name"))}
          required
          className="h-13"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={err("email")}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@studio.com"
            defaultValue={value("email")}
            aria-invalid={Boolean(err("email"))}
            required
            className="h-13"
          />
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
            className="h-13"
          />
        </Field>
      </div>
      <Field
        label="Password"
        htmlFor="password"
        error={err("password")}
        hint="At least 8 characters."
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a password"
          aria-invalid={Boolean(err("password"))}
          required
          className="h-13"
        />
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-xs font-medium text-muted-foreground">
          How will you use ArtMostSphere? Pick all that apply.
        </legend>
        {ROLES.map((role) => (
          <label
            key={role}
            className="group relative flex cursor-pointer items-start gap-4 rounded-md border bg-card p-4 transition-colors hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40"
          >
            <input
              type="checkbox"
              name="roles"
              value={role}
              defaultChecked={chosenRoles.includes(role)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-xs border border-charcoal/25 text-transparent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white dark:border-white/30"
            >
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">
                {ROLE_OPTIONS[role].title}
              </span>
              <span className="text-xs text-muted-foreground">
                {ROLE_OPTIONS[role].description}
              </span>
            </span>
          </label>
        ))}
        {err("roles") && (
          <p className="text-xs text-destructive">{err("roles")}</p>
        )}
      </fieldset>

      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-13 w-full text-base"
      >
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

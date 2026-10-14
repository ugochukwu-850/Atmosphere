"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { registerAction, type FormState } from "@/lib/auth/actions";
import { ROLES, ROLE_LABELS } from "@/lib/validators/auth";

export function RegisterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    registerAction,
    {},
  );
  const err = (key: string) => state.fieldErrors?.[key]?.[0];

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <Field label="Name" htmlFor="name" error={err("name")}>
        <Input id="name" name="name" autoComplete="name" required />
      </Field>
      <Field label="Email" htmlFor="email" error={err("email")}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Phone" htmlFor="phone" error={err("phone")}>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+234…"
          required
        />
      </Field>
      <Field
        label="Password"
        htmlFor="password"
        error={err("password")}
        hint="At least 8 characters."
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </Field>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium">I want to…</legend>
        {ROLES.map((role) => (
          <label key={role} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="roles"
              value={role}
              defaultChecked={role === "renter"}
              className="size-4 accent-primary"
            />
            {ROLE_LABELS[role]}
          </label>
        ))}
        {err("roles") && (
          <p className="text-sm text-destructive">{err("roles")}</p>
        )}
      </fieldset>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

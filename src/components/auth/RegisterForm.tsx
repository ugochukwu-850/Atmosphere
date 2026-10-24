"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { registerAction, type FormState } from "@/lib/auth/actions";
import type { ROLES } from "@/lib/validators/auth";

import { FormAlert } from "./AuthShell";
import { PasswordInput } from "./PasswordInput";

// "Select field" from the Figma "Viewer Bording" frame: Sora light label,
// 52px panel-filled input with a hairline ivory border and 10px radius.
const label = "font-heading text-xs leading-4 font-light tracking-[-0.01em]";
const input =
  "h-13 rounded-[10px] border-[0.5px] border-muted bg-card px-5 text-base font-light";

/** Create-account step; `roles` come from the path picked on step 1. */
export function RegisterForm({
  roles,
}: {
  roles: readonly (typeof ROLES)[number][];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    registerAction,
    {},
  );
  const err = (key: string) => state.fieldErrors?.[key]?.[0];
  const value = (key: string) => state.values?.[key] as string | undefined;

  return (
    <form action={action} className="flex flex-col" noValidate>
      {roles.map((role) => (
        <input key={role} type="hidden" name="roles" value={role} />
      ))}
      <Field
        label="Full Name"
        htmlFor="name"
        error={err("name")}
        className="gap-2.5"
        labelClassName={label}
      >
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="John Doe"
          defaultValue={value("name")}
          aria-invalid={Boolean(err("name"))}
          required
          className={input}
        />
      </Field>
      <div className="mt-[37px] grid gap-[25px] sm:grid-cols-2 sm:gap-1.5">
        <Field
          label="Email"
          htmlFor="email"
          error={err("email")}
          className="gap-2.5"
          labelClassName={label}
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            defaultValue={value("email")}
            aria-invalid={Boolean(err("email"))}
            required
            className={input}
          />
        </Field>
        <Field
          label="Number"
          htmlFor="phone"
          error={err("phone")}
          className="gap-2.5"
          labelClassName={label}
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+234 709 098 0098"
            defaultValue={value("phone")}
            aria-invalid={Boolean(err("phone"))}
            required
            className={input}
          />
        </Field>
      </div>
      <Field
        label="Create Password"
        htmlFor="password"
        error={err("password")}
        className="mt-[25px] gap-2.5"
        labelClassName={label}
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          aria-invalid={Boolean(err("password"))}
          required
          className={input}
        />
      </Field>

      {/* Roles come from step 1, so they only fail if the form was tampered with. */}
      {(state.error ?? err("roles")) && (
        <div className="mt-6">
          <FormAlert>{state.error ?? err("roles")}</FormAlert>
        </div>
      )}
      <Button
        type="submit"
        disabled={pending}
        className="mt-[57px] h-13 w-full rounded-[10px] font-heading text-sm font-normal"
      >
        {pending ? "Creating account…" : "Create Account"}
      </Button>
      <p className="mt-3.5 text-center text-[13px] leading-5 text-secondary-text">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-primary underline hover:text-primary-hover"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

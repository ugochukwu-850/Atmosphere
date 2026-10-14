"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { loginAction, type FormState } from "@/lib/auth/actions";

import { FormAlert } from "./AuthShell";
import { PasswordInput } from "./PasswordInput";

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "/";
  const [state, action, pending] = useActionState<FormState, FormData>(
    loginAction,
    {},
  );
  const err = (key: string) => state.fieldErrors?.[key]?.[0];

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next} />
      <Field label="Email" htmlFor="email" error={err("email")}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          defaultValue={state.values?.email as string | undefined}
          aria-invalid={Boolean(err("email"))}
          required
          className="h-13"
        />
      </Field>
      <Field label="Password" htmlFor="password" error={err("password")}>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          aria-invalid={Boolean(err("password"))}
          required
          className="h-13"
        />
      </Field>
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-13 w-full text-base"
      >
        {pending ? "Signing in…" : "Sign In"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to ArtMostSphere?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

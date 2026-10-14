"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { ApiError } from "@/lib/api/client";
import { loginSchema, registerSchema } from "@/lib/validators/auth";

import { authApi } from "./api";
import { clearSession, setSessionToken } from "./session";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /** Submitted values (never the password) so the form can be refilled. */
  values?: Record<string, string | string[]>;
};

/** Only allow same-site relative redirects after sign-in. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function apiMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return "Email or password is incorrect.";
    if (err.status === 429)
      return "Too many attempts. Wait a minute and try again.";
    return err.message;
  }
  return "Could not reach the server. Try again.";
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = { email: String(formData.get("email") ?? "") };
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success)
    return { values, fieldErrors: z.flattenError(parsed.error).fieldErrors };

  try {
    await setSessionToken(await authApi.login(parsed.data));
  } catch (err) {
    return { values, error: apiMessage(err) };
  }
  redirect(safeNext(formData.get("next")));
}

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    roles: formData.getAll("roles").map(String),
  };
  const parsed = registerSchema.safeParse({
    ...values,
    password: formData.get("password"),
  });
  if (!parsed.success)
    return { values, fieldErrors: z.flattenError(parsed.error).fieldErrors };

  try {
    await setSessionToken(await authApi.register(parsed.data));
  } catch (err) {
    return { values, error: apiMessage(err) };
  }
  redirect("/");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

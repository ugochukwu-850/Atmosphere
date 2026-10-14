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
};

/** Only allow same-site relative redirects after sign-in. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function apiMessage(err: unknown): string {
  if (err instanceof ApiError) {
    return err.status === 401 ? "Email or password is incorrect." : err.message;
  }
  return "Could not reach the server. Try again.";
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  try {
    const { token } = await authApi.login(parsed.data);
    await setSessionToken(token);
  } catch (err) {
    return { error: apiMessage(err) };
  }
  redirect(safeNext(formData.get("next")));
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    roles: formData.getAll("roles"),
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  try {
    const { token } = await authApi.register(parsed.data);
    await setSessionToken(token);
  } catch (err) {
    return { error: apiMessage(err) };
  }
  redirect("/");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

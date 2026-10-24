import { z } from "zod";

import { ApiError } from "@/lib/api/client";

/**
 * State returned by form server actions (used with useActionState).
 * `values` carries what was submitted (never passwords) so the form can be
 * refilled after React resets it.
 */
export type ActionState<
  V extends Record<string, unknown> = Record<string, string>,
> = {
  ok?: boolean;
  /** Id of whatever was created, for a follow-up link. */
  id?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Partial<V>;
};

/** Zod error → `{ field: [messages] }` for <Field error=...>. */
export function fieldErrors(error: z.ZodError) {
  return z.flattenError(error).fieldErrors as Record<
    string,
    string[] | undefined
  >;
}

/** Human message for an API failure, with optional per-status overrides. */
export function apiErrorMessage(
  err: unknown,
  overrides: Partial<Record<number, string>> = {},
): string {
  if (err instanceof ApiError) {
    if (overrides[err.status]) return overrides[err.status]!;
    if (err.status === 401) return "Your session expired. Sign in again.";
    if (err.status === 403)
      return "Your account can't do that yet. Add the role from your account.";
    if (err.status === 429)
      return "Too many attempts. Wait a minute and try again.";
    return err.message;
  }
  return "Could not reach the server. Try again.";
}

/** FormData value as a trimmed string ("" when missing). */
export function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

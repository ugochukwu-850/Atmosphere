"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { ApiError, unwrap } from "@/lib/api/client";
import { postV1CastCallsByIdApply, type IdOnlyCall } from "@/lib/api/generated";
import { client } from "@/lib/api/generated/client.gen";
import { getSessionToken } from "@/lib/auth/session";
import {
  apiErrorMessage,
  fieldErrors,
  str,
  type ActionState,
} from "@/lib/forms";
import { castingCallSchema } from "@/lib/validators/casting";
import { chosen } from "@/lib/validators/fields";

export type CallFormState = ActionState;

// Everything the form posts, echoed back on errors to refill it.
const CALL_FIELDS = [
  "title",
  "description",
  "roleNeededChoice",
  "roleNeededOther",
  "area",
  "neighborhood",
  "shootDate",
] as const;

/** "Post a casting call": POST /v1/cast/calls, then back to the board. */
export async function createCallAction(
  _prev: CallFormState,
  formData: FormData,
): Promise<CallFormState> {
  const values = Object.fromEntries(
    CALL_FIELDS.map((k) => [k, str(formData, k)]),
  );
  const token = await getSessionToken();
  if (!token) return { values, error: "Your session expired. Sign in again." };

  const parsed = castingCallSchema.safeParse({
    ...values,
    roleNeeded: chosen(formData, "roleNeeded"),
  });
  if (!parsed.success) {
    return { values, fieldErrors: fieldErrors(parsed.error) };
  }
  const { area, ...call } = parsed.data;

  try {
    // Spec gap: CastingCallRequest has no city/state/lat/lng. The demo
    // frontend sends them and GET /v1/cast/calls returns city and state, so
    // the API keeps them (cards show "Maitama, Abuja"). The generated SDK
    // only knows the spec, so post through the client directly.
    await unwrap(
      client.post<{ 201: IdOnlyCall }>({
        url: "/v1/cast/calls",
        auth: token,
        security: [{ scheme: "bearer", type: "http" }],
        body: { ...call, ...area },
      }),
    );
  } catch (err) {
    return { values, error: apiErrorMessage(err) };
  }
  redirect("/cast/calls");
}

export type InterestState = { ok?: boolean; error?: string; message?: string };

const interestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Tell them a little more (10+ characters).")
    .max(2000),
});

/** "Express interest" on a casting call: POST /v1/cast/calls/{id}/apply. */
export async function expressInterestAction(
  callId: string,
  _prev: InterestState,
  formData: FormData,
): Promise<InterestState> {
  const message = String(formData.get("message") ?? "");
  const token = await getSessionToken();
  if (!token) return { message, error: "Sign in to express interest." };

  const parsed = interestSchema.safeParse({ message });
  if (!parsed.success)
    return { message, error: parsed.error.issues[0]?.message };

  try {
    await unwrap(
      postV1CastCallsByIdApply({
        auth: token,
        path: { id: callId },
        body: parsed.data,
      }),
    );
    return { ok: true };
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) return { ok: true };
    return {
      message,
      error:
        err instanceof ApiError ? err.message : "Could not send. Try again.",
    };
  }
}

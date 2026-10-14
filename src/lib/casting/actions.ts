"use server";

import { z } from "zod";

import { ApiError, unwrap } from "@/lib/api/client";
import { postV1CastCallsByIdApply } from "@/lib/api/generated";
import { getSessionToken } from "@/lib/auth/session";

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

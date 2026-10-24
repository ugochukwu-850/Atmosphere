"use server";

import { z } from "zod";

import { unwrap } from "@/lib/api/client";
import { postV1Issues } from "@/lib/api/generated";
import { apiErrorMessage, str, type ActionState } from "@/lib/forms";

// The API caps the body at 2000; keep room for the "Page: /path" line.
const MESSAGE_MAX = 1800;
const PAGE_MAX = 190;

const messageSchema = z
  .string()
  .trim()
  .min(5, "Tell us a little more about what happened")
  .max(MESSAGE_MAX, "Use 1,800 characters or fewer");

/** "Report an issue": POST /v1/issues (public, no account needed). */
export async function reportIssueAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = { body: str(formData, "body") };
  const parsed = messageSchema.safeParse(values.body);
  if (!parsed.success)
    return { values, fieldErrors: { body: [parsed.error.issues[0]!.message] } };

  // The form adds the path it was sent from; only accept a same-site path.
  const page = str(formData, "page");
  const where =
    page.startsWith("/") && !page.startsWith("//")
      ? `\n\nPage: ${page.slice(0, PAGE_MAX)}`
      : "";

  try {
    await unwrap(postV1Issues({ body: { body: parsed.data + where } }));
  } catch (err) {
    return { values, error: apiErrorMessage(err) };
  }
  return { ok: true };
}

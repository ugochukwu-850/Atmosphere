"use server";

import { z } from "zod";

import { getSessionToken } from "@/lib/auth/session";
import { createPlan } from "@/lib/data/planner";
import {
  apiErrorMessage,
  fieldErrors,
  str,
  type ActionState,
} from "@/lib/forms";

import { isEmptyPlan, type Plan } from "./types";

export type PlanFormValues = { idea: string; area: string };

/**
 * The plan comes back in the state (rather than a redirect) so the page can
 * show it straight from the POST response; the client then puts
 * `?c=<conversationId>` in the URL so a reload loads it from the API.
 */
export type PlanActionState = ActionState<PlanFormValues> & { plan?: Plan };

// Limits from the API's PlannerRequest schema.
const planSchema = z.object({
  idea: z
    .string()
    .min(4, "Describe the shoot in a few more words.")
    .max(2000, "Keep the brief under 2,000 characters."),
  area: z.string().max(80, "Keep the area under 80 characters.").optional(),
  conversationId: z.string().optional(),
});

/** POST /v1/planner: a new plan, or a follow-up when `conversationId` is set. */
export async function createPlanAction(
  _prev: PlanActionState,
  formData: FormData,
): Promise<PlanActionState> {
  const values = { idea: str(formData, "idea"), area: str(formData, "area") };
  const parsed = planSchema.safeParse({
    idea: values.idea,
    area: values.area || undefined,
    conversationId: str(formData, "conversationId") || undefined,
  });
  if (!parsed.success)
    return { fieldErrors: fieldErrors(parsed.error), values };

  const token = await getSessionToken();
  if (!token) return { error: "Your session expired. Sign in again.", values };

  try {
    const plan = await createPlan(token, parsed.data);
    if (isEmptyPlan(plan)) {
      return {
        error:
          "The planner came back empty. Add a little more detail and try again.",
        values,
      };
    }
    // Keep the area for the next follow-up; the brief box starts empty.
    return {
      ok: true,
      id: plan.conversationId,
      plan,
      values: { area: values.area },
    };
  } catch (err) {
    return {
      error: apiErrorMessage(err, {
        403: "That plan belongs to another account. Start a new one.",
        404: "That plan no longer exists. Start a new one.",
      }),
      values,
    };
  }
}

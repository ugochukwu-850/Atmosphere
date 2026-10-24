import { z } from "zod";

import { areaField, blankToUndefined, type Choice } from "./fields";
import { TALENT_CATEGORIES } from "./listing";

/** Roles a call can ask for: the talent categories, plus extras. */
export const ROLE_CHOICES: Choice[] = [
  ...TALENT_CATEGORIES,
  { value: "extra", label: "Extra" },
];

/** Today as YYYY-MM-DD in Lagos, where every shoot date is set. */
export function lagosToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** CastingCallRequest limits, on raw form strings. */
export const castingCallSchema = z.object({
  title: z
    .string()
    .min(4, "Give the call a title (4+ characters).")
    .max(120, "Keep the title to 120 characters."),
  description: z
    .string()
    .min(12, "Describe the role and the shoot (12+ characters).")
    .max(4000, "Keep the brief to 4,000 characters."),
  roleNeeded: z
    .string()
    .min(2, "Name the role, like actor or extra.")
    .max(80, "Keep the role to 80 characters."),
  area: areaField("Choose the city you're shooting in."),
  neighborhood: z
    .string()
    .min(2, "Add the neighbourhood, like Lekki or Maitama.")
    .max(80, "Keep the neighbourhood to 80 characters."),
  shootDate: z.preprocess(
    blankToUndefined,
    z.iso
      .date({ error: "Pick a valid date." })
      .refine((date) => date >= lagosToday(), "Pick today or a later date.")
      .optional(),
  ),
});

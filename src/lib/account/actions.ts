"use server";

import { revalidatePath } from "next/cache";

import { unwrap } from "@/lib/api/client";
import {
  patchV1UsersMe,
  postV1UsersMeRoles,
  putV1UsersMeSocial,
} from "@/lib/api/generated";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { getSessionToken, setSessionToken } from "@/lib/auth/session";
import {
  apiErrorMessage,
  fieldErrors,
  str,
  type ActionState,
} from "@/lib/forms";
import {
  profileSchema,
  roleSchema,
  SOCIAL_PLATFORMS,
  socialsSchema,
} from "@/lib/validators/account";

const SIGNED_OUT = "Your session expired. Sign in again.";

/** Profile panel: PATCH /v1/users/me with name, phone and profile fields. */
export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = {
    name: str(formData, "name"),
    phone: str(formData, "phone"),
    neighborhood: str(formData, "neighborhood"),
    // The API stores specialties as one comma-separated string; tidy spacing.
    specialties: str(formData, "specialties")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", "),
    bio: str(formData, "bio"),
  };
  const token = await getSessionToken();
  if (!token) return { values, error: SIGNED_OUT };

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success)
    return { values, fieldErrors: fieldErrors(parsed.error) };

  // Empty profile strings are sent on purpose: that is how a field is cleared.
  const { name, phone, ...profile } = parsed.data;
  try {
    await unwrap(
      patchV1UsersMe({ auth: token, body: { name, phone, profile } }),
    );
  } catch (err) {
    return { values, error: apiErrorMessage(err) };
  }
  revalidatePath("/account");
  return { ok: true, values };
}

/** Roles panel: POST /v1/users/me/roles for one missing role. */
export async function addRoleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = { role: str(formData, "role") };
  const token = await getSessionToken();
  if (!token) return { values, error: SIGNED_OUT };

  const parsed = roleSchema.safeParse(values.role);
  if (!parsed.success)
    return { values, error: parsed.error.issues[0]?.message };

  try {
    const result = await postV1UsersMeRoles({
      auth: token,
      body: { role: parsed.data },
    });
    await unwrap(Promise.resolve(result));
    // If the API re-issues the session for the new role, keep the fresh one.
    const fresh = result.response?.headers
      .getSetCookie()
      .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
      ?.split(";")[0]
      ?.slice(SESSION_COOKIE.length + 1);
    if (fresh) await setSessionToken(fresh);
  } catch (err) {
    return { values, error: apiErrorMessage(err) };
  }
  revalidatePath("/account");
  return { ok: true, values };
}

/** Social panel: PUT /v1/users/me/social replaces the whole list. */
export async function updateSocialsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values: Record<string, string> = {
    showFeed: str(formData, "showFeed"),
  };
  for (const platform of SOCIAL_PLATFORMS)
    values[platform] = str(formData, platform);

  const token = await getSessionToken();
  if (!token) return { values, error: SIGNED_OUT };

  const parsed = socialsSchema.safeParse(values);
  if (!parsed.success)
    return { values, fieldErrors: fieldErrors(parsed.error) };

  const data = parsed.data;
  const accounts = SOCIAL_PLATFORMS.filter((platform) => data[platform]).map(
    (platform) => ({
      platform,
      handle: data[platform],
      showFeed: data.showFeed === platform,
    }),
  );
  try {
    await unwrap(putV1UsersMeSocial({ auth: token, body: { accounts } }));
  } catch (err) {
    return { values, error: apiErrorMessage(err) };
  }
  revalidatePath("/account");
  return { ok: true, values };
}

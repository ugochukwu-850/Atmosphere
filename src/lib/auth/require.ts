import { redirect } from "next/navigation";

import { getCurrentUser, getSessionToken } from "./session";
import type { SessionUser } from "./types";

/**
 * Signed-in user + API token for a workspace page or action, or a redirect to
 * /login?next=<path>. The proxy already bounces visitors without a cookie;
 * this also catches expired tokens. Dynamic (reads cookies): call inside Suspense.
 */
export async function requireUser(
  nextPath: string,
): Promise<{ user: SessionUser; token: string }> {
  const [user, token] = await Promise.all([
    getCurrentUser(),
    getSessionToken(),
  ]);
  if (!user || !token) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return { user, token };
}

export function hasRole(
  user: SessionUser,
  role: "renter" | "owner" | "talent" | "admin",
) {
  return user.roles.includes(role);
}

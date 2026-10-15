import { cookies } from "next/headers";
import { cache } from "react";

import { authApi } from "./api";
import { SESSION_COOKIE } from "./constants";
import type { SessionUser } from "./types";

export async function setSessionToken(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

/**
 * Current user, or null when signed out or the token is rejected.
 * Dynamic (reads cookies): wrap callers in <Suspense>. Deduped per request.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await authApi.me(token);
  } catch {
    // Expired token or API down: treat as signed out.
    return null;
  }
});

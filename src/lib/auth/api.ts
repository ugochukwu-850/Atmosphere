import { ApiError, unwrap } from "@/lib/api/client";
import { getV1AuthMe, postV1AuthLogin, postV1AuthRegister } from "@/lib/api/generated";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth";

import { SESSION_COOKIE } from "./constants";
import type { SessionUser } from "./types";

/**
 * The API returns the session JWT only as an `ams_session` Set-Cookie on its
 * own origin. We call it server-side, lift the token out, and store it in our
 * own httpOnly cookie (see session.ts).
 */
function sessionTokenFrom(response: Response | undefined): string {
  const cookie = response?.headers
    .getSetCookie()
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  const token = cookie?.split(";")[0]?.slice(SESSION_COOKIE.length + 1);
  if (!token) throw new ApiError(502, "Signed in, but the API did not return a session.");
  return token;
}

async function withToken(
  call: Promise<{ data?: unknown; error?: unknown; response?: Response }>,
): Promise<string> {
  const result = await call;
  await unwrap(Promise.resolve(result));
  return sessionTokenFrom(result.response);
}

function toSessionUser(user: { id?: string; name?: string; email?: string; roles?: string[] }): SessionUser {
  return {
    id: user.id ?? "",
    name: user.name ?? "",
    email: user.email ?? "",
    roles: user.roles ?? [],
  };
}

export const authApi = {
  login: (body: LoginInput) => withToken(postV1AuthLogin({ body })),
  register: (body: RegisterInput) => withToken(postV1AuthRegister({ body })),
  me: async (token: string): Promise<SessionUser | null> => {
    const data = await unwrap(getV1AuthMe({ auth: token }));
    return data.user?.id ? toSessionUser(data.user) : null;
  },
};

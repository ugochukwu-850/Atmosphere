/** The signed-in user's own account: profile, roles and social accounts. */
import { unwrap } from "@/lib/api/client";
import { getV1UsersMe } from "@/lib/api/generated";

import { toAccount } from "./normalize";
import type { Account } from "./types";

/** GET /v1/users/me. Null when the API returns no user. */
export async function getAccount(token: string): Promise<Account | null> {
  const data = await unwrap(getV1UsersMe({ auth: token }));
  return data.user?.id ? toAccount(data.user) : null;
}

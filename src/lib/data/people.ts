/**
 * People data: public profiles. Account (the signed-in user's own profile)
 * belongs in ./account.
 */
import { orNull, unwrap } from "@/lib/api/client";
import { type PublicUser } from "@/lib/api/generated";
import { client } from "@/lib/api/generated/client.gen";

import { toPerson } from "./normalize";
import type { Person } from "./types";

export async function getPerson(id: string): Promise<Person | null> {
  // Spec gap: the 200 response is typed as `Ok`; the API returns `{ user }`.
  const data = await orNull(
    unwrap(
      client.get<{ 200: { user?: PublicUser } }>({
        url: "/v1/users/{id}",
        path: { id },
      }),
    ),
  );
  return data?.user ? toPerson(data.user) : null;
}

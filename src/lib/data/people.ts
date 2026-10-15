/**
 * People data: public profiles. Account (the signed-in user's own profile)
 * belongs in ./account.
 */
import { orNull, unwrap } from "@/lib/api/client";
import { type PublicUser } from "@/lib/api/generated";
import { client } from "@/lib/api/generated/client.gen";
import type { SocialPlatform } from "@/lib/validators/account";

import { toFeed, toPerson } from "./normalize";
import type { FeedPost, Person } from "./types";

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

/**
 * Latest public posts from the profile's chosen social account. A third-party
 * feed must never break the profile, so any failure (including the 404 for
 * "no linked social account") resolves to an empty list.
 */
export async function getFeed(
  id: string,
  platform: SocialPlatform,
): Promise<FeedPost[]> {
  try {
    // Spec gap: the 200 response is typed as `Ok`; see toFeed for the shape.
    const data = await unwrap(
      client.get<{ 200: unknown }>({
        url: "/v1/users/{id}/feed",
        path: { id },
        query: { platform },
      }),
    );
    return toFeed(data).slice(0, 6);
  } catch {
    return [];
  }
}

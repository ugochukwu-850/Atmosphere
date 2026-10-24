/**
 * Saved items ("Saved item" in the dashboard). The API has no favourites yet,
 * so the shortlist lives in a per-browser cookie: the bookmark button writes
 * it on the client and the dashboard reads it on the server.
 */
export const SAVED_COOKIE = "ams_saved";

/** Legacy localStorage key, migrated into the cookie on first read. */
export const LEGACY_SAVED_KEY = "ams-saved";

/** Keeps the cookie well under the 4KB limit (ids are ~25 characters). */
export const MAX_SAVED = 100;

export function parseSaved(value: string | undefined): string[] {
  if (!value) return [];
  return decodeURIComponent(value)
    .split(",")
    .filter((id) => /^[\w-]+$/.test(id))
    .slice(0, MAX_SAVED);
}

export function serializeSaved(ids: string[]): string {
  return encodeURIComponent(ids.slice(0, MAX_SAVED).join(","));
}

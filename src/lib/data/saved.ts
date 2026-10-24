/** Saved items for the dashboard, read from the per-browser cookie (see lib/saved). */
import { cookies } from "next/headers";

import { parseSaved, SAVED_COOKIE } from "@/lib/saved";

import { getItem, getTalent } from "./catalog";
import type { ItemDetail } from "./types";

export async function getSavedIds(): Promise<string[]> {
  return parseSaved((await cookies()).get(SAVED_COOKIE)?.value);
}

/**
 * Resolve saved ids to items, newest first. Ids that no longer resolve (deleted
 * listings, scout pins, failed fetches) are skipped: a stale bookmark must
 * never break the dashboard.
 */
export async function getSavedItems(
  ids: string[],
  limit?: number,
): Promise<ItemDetail[]> {
  const items = await Promise.all(
    ids.slice(0, limit).map(async (id) => {
      try {
        return (await getItem(id)) ?? (await getTalent(id));
      } catch {
        return null;
      }
    }),
  );
  return items.filter((item): item is ItemDetail => item !== null);
}

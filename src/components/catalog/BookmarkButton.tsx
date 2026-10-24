"use client";

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

import {
  LEGACY_SAVED_KEY,
  parseSaved,
  SAVED_COOKIE,
  serializeSaved,
} from "@/lib/saved";
import { cn } from "@/lib/utils";

// Saved items are a per-browser cookie until the API has favourites (see lib/saved).
const listeners = new Set<() => void>();
const ONE_YEAR = 60 * 60 * 24 * 365;

function write(ids: string[]) {
  document.cookie = `${SAVED_COOKIE}=${serializeSaved(ids)}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

function readIds(): string[] {
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${SAVED_COOKIE}=`))
    ?.slice(SAVED_COOKIE.length + 1);
  if (raw !== undefined) return parseSaved(raw);

  // Items saved before the cookie existed lived in localStorage.
  try {
    const legacy = localStorage.getItem(LEGACY_SAVED_KEY);
    if (legacy) {
      const ids = parseSaved(legacy);
      write(ids);
      localStorage.removeItem(LEGACY_SAVED_KEY);
      return ids;
    }
  } catch {
    // Storage blocked: nothing to migrate.
  }
  return [];
}

const read = () => readIds().join(",");

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function toggle(id: string) {
  const ids = readIds();
  // Newest first, so the dashboard shortlist shows recent saves.
  write(ids.includes(id) ? ids.filter((i) => i !== id) : [id, ...ids]);
  listeners.forEach((l) => l());
}

/** White round bookmark on card photos (Figma: Location Search card). */
export function BookmarkButton({
  id,
  title,
  className,
  refresh,
}: {
  id: string;
  title: string;
  className?: string;
  /** Re-render server data after a change (pages that list saved items). */
  refresh?: boolean;
}) {
  const router = useRouter();
  const saved = useSyncExternalStore(
    subscribe,
    () => read().split(",").includes(id),
    () => false,
  );
  return (
    <button
      type="button"
      onClick={() => {
        toggle(id);
        if (refresh) router.refresh();
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      className={cn(
        "grid size-8 place-items-center rounded-full bg-white text-charcoal shadow-sm",
        className,
      )}
    >
      <Bookmark
        className={cn("size-4", saved && "fill-current")}
        strokeWidth={1.75}
      />
    </button>
  );
}

"use client";

import { Bookmark } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

// Saved items are a per-browser convenience until the API has favourites.
const KEY = "ams-saved";
const listeners = new Set<() => void>();

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function toggle(id: string) {
  const ids = new Set(read().split(",").filter(Boolean));
  if (ids.has(id)) ids.delete(id);
  else ids.add(id);
  try {
    localStorage.setItem(KEY, [...ids].join(","));
  } catch {
    // Storage blocked: nothing to persist.
  }
  listeners.forEach((l) => l());
}

/** White round bookmark on card photos (Figma: Location Search card). */
export function BookmarkButton({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const saved = useSyncExternalStore(
    subscribe,
    () => read().split(",").includes(id),
    () => false,
  );
  return (
    <button
      type="button"
      onClick={() => toggle(id)}
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

"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { AREA_COOKIE, parseArea, serializeArea, type Area } from "@/lib/area/area";

type AreaContextValue = { area: Area; setArea: (area: Area) => void };

const AreaContext = createContext<AreaContextValue | null>(null);

// The cookie is the single source of truth so server components can read it too.
const listeners = new Set<() => void>();

function readCookie(): string {
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${AREA_COOKIE}=`));
  return match ? match.slice(AREA_COOKIE.length + 1) : "";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function AreaProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, readCookie, () => "");
  const area = parseArea(raw);

  const setArea = useCallback(
    (next: Area) => {
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = `${AREA_COOKIE}=${serializeArea(next)}; path=/; max-age=${oneYear}; samesite=lax`;
      listeners.forEach((l) => l());
      // Re-render server components that sort or filter by area.
      router.refresh();
    },
    [router],
  );

  return <AreaContext value={{ area, setArea }}>{children}</AreaContext>;
}

export function useArea() {
  const ctx = useContext(AreaContext);
  if (!ctx) throw new Error("useArea must be used inside <AreaProvider>");
  return ctx;
}

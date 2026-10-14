"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const TARGETS = [
  { value: "/locations", label: "Locations" },
  { value: "/gear", label: "Gear" },
  { value: "/cast", label: "Talent" },
] as const;

export function HeroSearch() {
  const router = useRouter();
  const [target, setTarget] = useState<string>(TARGETS[0].value);
  const [q, setQ] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `${target}?q=${encodeURIComponent(q.trim())}` : target);
      }}
      className="flex w-full max-w-3xl flex-col gap-2 rounded-2xl bg-background p-2 text-foreground shadow-2xl sm:flex-row sm:items-center"
    >
      <label htmlFor="hero-target" className="sr-only">
        Looking for
      </label>
      <select
        id="hero-target"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="h-12 rounded-xl bg-muted px-4 text-sm font-medium outline-none"
      >
        {TARGETS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <label htmlFor="hero-q" className="sr-only">
        Search
      </label>
      <input
        id="hero-q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="White cyc in Yaba, C70 kit, Hausa voice artist…"
        className="h-12 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
      />
      <Button type="submit" size="lg" className="h-12 rounded-xl">
        Search
      </Button>
    </form>
  );
}

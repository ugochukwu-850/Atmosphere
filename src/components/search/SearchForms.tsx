"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useArea } from "@/components/area/AreaProvider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/form";
import { areaLabel } from "@/lib/area/area";
import {
  SEARCH_TARGETS,
  searchHref,
  targetFor,
  targetForPath,
  type SearchTargetKey,
} from "@/lib/search/targets";
import { cn } from "@/lib/utils";

import { AreaSelect, decodeArea, encodeArea } from "./AreaSelect";

const field =
  "h-13 w-full rounded-sm bg-muted/60 px-4 text-sm text-foreground placeholder:text-subtle-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

/** Shared state + submit for both search UIs. */
function useSearchForm(initialTarget: SearchTargetKey) {
  const router = useRouter();
  const { area, setArea } = useArea();
  const [targetKey, setTargetKey] = useState<SearchTargetKey>(initialTarget);
  const [q, setQ] = useState("");
  const [where, setWhere] = useState(() => encodeArea(area));
  const [date, setDate] = useState("");

  const target = targetFor(targetKey);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setArea(decodeArea(where));
    router.push(searchHref(target, q, date));
  };

  return {
    target,
    targetKey,
    setTargetKey,
    q,
    setQ,
    where,
    setWhere,
    date,
    setDate,
    submit,
  };
}

/** White search card overlapping the landing hero (Figma: Landing Page / Frame 1). */
export function HeroSearchCard({ className }: { className?: string }) {
  const s = useSearchForm("location");

  return (
    <form
      role="search"
      onSubmit={s.submit}
      className={cn(
        "flex flex-col gap-6 rounded-xl bg-white p-6 text-charcoal shadow-[0_8px_40px_rgb(0_0_0/0.12)] md:p-8",
        className,
      )}
    >
      <div
        role="tablist"
        aria-label="Search for"
        className="flex w-fit flex-wrap gap-1 rounded-md bg-ivory/70 p-1.5"
      >
        {SEARCH_TARGETS.map((t) => {
          const active = t.key === s.targetKey;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => s.setTargetKey(t.key)}
              className={cn(
                "h-[35px] rounded-sm px-4 text-xs font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-charcoal-600 hover:text-charcoal",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid items-end gap-5 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.77fr] lg:gap-[27px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-q" className="text-charcoal-600">
            What are you planning?
          </Label>
          <input
            id="hero-q"
            value={s.q}
            onChange={(e) => s.setQ(e.target.value)}
            placeholder={s.target.placeholder}
            className={cn(field, "bg-ivory/50")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-where" className="text-charcoal-600">
            Where?
          </Label>
          <AreaSelect
            id="hero-where"
            value={s.where}
            onChange={(e) => s.setWhere(e.target.value)}
            selectClassName={cn(field, "bg-ivory/50")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-when" className="text-charcoal-600">
            When?
          </Label>
          <input
            id="hero-when"
            type="date"
            value={s.date}
            onChange={(e) => s.setDate(e.target.value)}
            className={cn(
              field,
              "bg-ivory/50",
              !s.date && "text-subtle-foreground",
            )}
          />
        </div>
        <Button type="submit" className="h-13 text-sm">
          <Search className="size-4" />
          Search
        </Button>
      </div>
    </form>
  );
}

/**
 * Compact "What | Where | When" pill in the site header (Figma: Location Search
 * header). Opens a small panel with the full fields.
 */
export function CompactSearch({ className }: { className?: string }) {
  const pathname = usePathname();
  const { area } = useArea();
  const s = useSearchForm(targetForPath(pathname).key);
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="compact-search"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-11 w-[23rem] items-center gap-3 rounded-sm pr-1.5 pl-3 text-[11px]",
          "group-data-[tone=dark]/header:border group-data-[tone=dark]/header:border-white/30 group-data-[tone=dark]/header:text-white",
          "group-data-[tone=light]/header:bg-ivory group-data-[tone=light]/header:text-charcoal",
        )}
      >
        <span className="truncate">{s.target.label}</span>
        <span aria-hidden className="h-3 w-px bg-current opacity-30" />
        <span className="truncate">{areaLabel(area)}</span>
        <span aria-hidden className="h-3 w-px bg-current opacity-30" />
        <span className="truncate">{s.date || "Any date"}</span>
        <span className="ml-auto grid size-7 shrink-0 place-items-center rounded-xs bg-primary text-primary-foreground">
          <Search className="size-3.5" />
          <span className="sr-only">Open search</span>
        </span>
      </button>

      {open && (
        <form
          id="compact-search"
          role="search"
          onSubmit={(e) => {
            setOpen(false);
            s.submit(e);
          }}
          className="absolute top-full right-0 z-50 mt-2 flex w-[23rem] flex-col gap-4 rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs-what">What</Label>
            <select
              id="cs-what"
              value={s.targetKey}
              onChange={(e) =>
                s.setTargetKey(e.target.value as SearchTargetKey)
              }
              className={cn(field, "h-11 appearance-none")}
            >
              {SEARCH_TARGETS.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              aria-label="Keywords"
              value={s.q}
              onChange={(e) => s.setQ(e.target.value)}
              placeholder={s.target.placeholder}
              className={cn(field, "h-11")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs-where">Where</Label>
            <AreaSelect
              id="cs-where"
              value={s.where}
              onChange={(e) => s.setWhere(e.target.value)}
              selectClassName={cn(field, "h-11")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs-when">When</Label>
            <input
              id="cs-when"
              type="date"
              value={s.date}
              onChange={(e) => s.setDate(e.target.value)}
              className={cn(field, "h-11")}
            />
          </div>
          <Button type="submit" size="lg">
            <Search className="size-4" />
            Search
          </Button>
        </form>
      )}
    </div>
  );
}

"use client";

import {
  Calendar,
  ChevronRight,
  Clapperboard,
  FileText,
  MapPin,
  MessageSquareText,
  Package,
  Video,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useId, useState, type KeyboardEvent, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import { formatNgn } from "@/lib/format";
import { shootKindLabel, type Plan } from "@/lib/planner/types";
import { cn } from "@/lib/utils";

import { PlanReply } from "./PlanReply";
import { PlanSuggestions } from "./PlanSuggestions";

type TabKey = "overview" | "kit" | "suggestions" | "estimate";

const days = (n: number) => `${n} day${n === 1 ? "" : "s"}`;
const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? "" : "s"}`;

/**
 * A generated production plan, modelled on the landing page's plan card
 * (Figma: Planner card): header with shoot facts, an ivory tab bar with the
 * rust active tab, and ivory panels holding white item cards.
 */
export function PlanView({ plan, busy }: { plan: Plan; busy?: boolean }) {
  // Only sections the plan has data for.
  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
  ];
  if (plan.kitNeeds.length > 0)
    tabs.push({ key: "kit", label: "Kit", count: plan.kitNeeds.length });
  if (plan.suggestions.length > 0)
    tabs.push({
      key: "suggestions",
      label: "Suggestions",
      count: plan.suggestions.length,
    });
  if (plan.estimate) tabs.push({ key: "estimate", label: "Estimate" });

  const [selected, setSelected] = useState<TabKey>("overview");
  // A follow-up can drop a section; fall back to the overview.
  const tab = tabs.some((t) => t.key === selected) ? selected : "overview";
  const id = useId();
  const tabId = (key: TabKey) => `${id}-tab-${key}`;

  const open = (key: TabKey) => {
    setSelected(key);
    document.getElementById(tabId(key))?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.key === tab);
    const next =
      e.key === "ArrowRight"
        ? tabs[(i + 1) % tabs.length]
        : e.key === "ArrowLeft"
          ? tabs[(i - 1 + tabs.length) % tabs.length]
          : e.key === "Home"
            ? tabs[0]
            : e.key === "End"
              ? tabs[tabs.length - 1]
              : undefined;
    if (!next) return;
    e.preventDefault();
    open(next.key);
  };

  return (
    <article
      aria-busy={busy}
      aria-label="Production plan"
      className={cn(
        "overflow-hidden rounded-xl border border-sand/40 bg-card transition-opacity dark:border-border",
        busy && "pointer-events-none opacity-60",
      )}
    >
      <PlanHeader plan={plan} />

      <div className="flex flex-col gap-5 px-5 pb-6 md:px-8 md:pb-8">
        <div
          role="tablist"
          aria-label="Plan sections"
          onKeyDown={onKeyDown}
          className="flex gap-1 overflow-x-auto rounded-md bg-muted p-2"
        >
          {tabs.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                id={tabId(t.key)}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`${id}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelected(t.key)}
                className={cn(
                  "flex-1 rounded-sm px-4 py-2 text-center text-sm whitespace-nowrap transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
                {t.count !== undefined && (
                  <span className="ml-1.5 opacity-70">{t.count}</span>
                )}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={tabId(tab)}
          className="flex flex-col gap-5"
        >
          {tab === "overview" && <Overview plan={plan} open={open} />}
          {tab === "kit" && <Kit plan={plan} />}
          {tab === "suggestions" && (
            <PlanSuggestions suggestions={plan.suggestions} />
          )}
          {tab === "estimate" && plan.estimate && (
            <Estimate estimate={plan.estimate} />
          )}
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------- header

function PlanHeader({ plan }: { plan: Plan }) {
  const title =
    plan.title ??
    (plan.shootKind
      ? `${shootKindLabel(plan.shootKind)} plan`
      : "Your production plan");
  const cover = plan.suggestions.find(
    (s) => (s.kind === "location" || s.kind === "pin") && s.photoUrl,
  )?.photoUrl;

  const facts = [
    plan.shootKind && {
      icon: Video,
      label: "Shoot type",
      value: shootKindLabel(plan.shootKind),
    },
    // Saved plans may not echo the area back; leave it out rather than guess.
    plan.area && { icon: MapPin, label: "Area", value: plan.area },
    plan.estimate?.days && {
      icon: Calendar,
      label: "Shoot days",
      value: days(plan.estimate.days),
    },
    plan.estimate?.totalNgn && {
      icon: Wallet,
      label: "Indicative cost",
      value: formatNgn(plan.estimate.totalNgn),
    },
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string }[];

  const heading = (
    <>
      <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {plan.brief && (
        <p className="mt-2 line-clamp-3 max-w-[48rem] text-sm text-muted-foreground">
          {plan.brief}
        </p>
      )}
    </>
  );

  return (
    <header className="flex flex-col gap-5 pb-5">
      {cover ? (
        <div className="relative h-56">
          <SafeImage
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 90vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/40 to-card" />
          <div className="absolute inset-x-5 bottom-2 md:inset-x-8">
            {heading}
          </div>
        </div>
      ) : (
        <div className="px-5 pt-6 md:px-8 md:pt-8">{heading}</div>
      )}

      <dl className="flex flex-wrap gap-x-10 gap-y-3 px-5 md:px-8">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon
              aria-hidden
              className="size-4 text-muted-foreground"
              strokeWidth={1.5}
            />
            <div className="leading-tight">
              <dt className="text-[11px] text-muted-foreground">{label}</dt>
              <dd className="text-sm">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </header>
  );
}

// ---------------------------------------------------------------- panels

/** Ivory panel with an icon heading ("Production Requirements"). */
function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-md bg-muted p-4 md:p-5">
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden
          className="mt-0.5 size-5 shrink-0 text-muted-foreground"
          strokeWidth={1.5}
        />
        <div>
          <h3 className="font-sans text-base font-semibold">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

/** White card inside an ivory panel. */
const item = "rounded-md bg-background p-3";

function Overview({ plan, open }: { plan: Plan; open: (tab: TabKey) => void }) {
  const kinds = (...k: string[]) =>
    plan.suggestions.filter((s) => k.includes(s.kind)).length;
  const inCatalog = plan.kitNeeds.filter((k) => k.inCatalog).length;

  const requirements = [
    plan.kitNeeds.length > 0 && {
      title: "Professional kit",
      detail: `${count(plan.kitNeeds.length, "item")} · ${inCatalog} on the platform`,
      tab: "kit",
    },
    kinds("location", "pin") > 0 && {
      title: "Locations",
      detail: count(kinds("location", "pin"), "place"),
      tab: "suggestions",
    },
    kinds("gear", "gear_sale") > 0 && {
      title: "Gear",
      detail: count(kinds("gear", "gear_sale"), "listing"),
      tab: "suggestions",
    },
    kinds("talent") > 0 && {
      title: "Cast and crew",
      detail: count(kinds("talent"), "creative"),
      tab: "suggestions",
    },
    plan.estimate && {
      title: "Budget",
      detail: [
        plan.estimate.totalNgn ? formatNgn(plan.estimate.totalNgn) : "",
        plan.estimate.days ? days(plan.estimate.days) : "",
      ]
        .filter(Boolean)
        .join(" · "),
      tab: "estimate",
    },
  ].filter(Boolean) as { title: string; detail: string; tab: TabKey }[];

  return (
    <>
      {requirements.length > 0 && (
        <Section
          icon={FileText}
          title="Production Requirements"
          description="Here's what your production needs based on your brief"
        >
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {requirements.map((req) => (
              <li key={req.title}>
                <button
                  type="button"
                  onClick={() => open(req.tab)}
                  className={cn(
                    item,
                    "flex w-full items-end justify-between gap-3 text-left transition-colors hover:text-primary",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  )}
                >
                  <span>
                    <span className="block text-sm font-medium">
                      {req.title}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {req.detail}
                    </span>
                  </span>
                  <ChevronRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {plan.reply && (
        <Section icon={MessageSquareText} title="Planner notes">
          <div className={cn(item, "p-4 md:p-5")}>
            <PlanReply reply={plan.reply} />
          </div>
        </Section>
      )}

      {plan.shots.length > 0 && (
        <Section
          icon={Clapperboard}
          title="Shot types"
          description="Coverage to plan the edit around, not a storyboard"
        >
          <ol className="grid gap-2.5 sm:grid-cols-2">
            {plan.shots.map((shot, i) => (
              <li key={i} className={cn(item, "flex gap-3 text-sm")}>
                <span
                  aria-hidden
                  className="font-heading font-semibold text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {shot}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {plan.followUps.length > 0 && (
        <Section
          icon={MessageSquareText}
          title="Refinements"
          description="Follow-ups applied to this plan, oldest first"
        >
          <ul className="flex flex-col gap-2.5">
            {plan.followUps.map((text, i) => (
              <li key={i} className={cn(item, "text-sm")}>
                {text}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

function Kit({ plan }: { plan: Plan }) {
  const inCatalog = plan.kitNeeds.filter((k) => k.inCatalog).length;
  return (
    <Section
      icon={Package}
      title="Professional kit"
      description={`What a crew would pack for this brief, even when it isn't listed yet. ${inCatalog} of ${plan.kitNeeds.length} on the platform.`}
    >
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {plan.kitNeeds.map((need, i) => (
          <li
            key={`${need.id}-${i}`}
            className={cn(item, "flex flex-col gap-1.5 p-4")}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">{need.name}</p>
              <Badge variant={need.inCatalog ? "scout" : "neutral"}>
                {need.inCatalog ? "In catalog" : "Not listed yet"}
              </Badge>
            </div>
            {need.purpose && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {need.purpose}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Estimate({ estimate }: { estimate: NonNullable<Plan["estimate"]> }) {
  const rows = [
    { label: "Locations", value: estimate.locationsNgn },
    { label: "Kit", value: estimate.gearNgn },
    { label: "Creatives", value: estimate.talentNgn },
  ];
  return (
    <Section
      icon={Wallet}
      title="Indicative catalog cost"
      description="What the matched catalog rows would cost for this plan"
    >
      <div className="grid gap-2.5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className={cn(item, "flex flex-col justify-center gap-1 p-5")}>
          <p className="font-heading text-[34px] leading-none font-bold">
            {formatNgn(estimate.totalNgn)}
          </p>
          <p className="text-sm text-muted-foreground">
            {estimate.days
              ? `Total for ${days(estimate.days)}`
              : "Total for the plan"}
          </p>
        </div>
        <dl className={cn(item, "flex flex-col px-5 py-2")}>
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 border-b py-3 text-sm last:border-b-0"
            >
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-semibold">{formatNgn(row.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
      {estimate.note && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {estimate.note}
        </p>
      )}
    </Section>
  );
}

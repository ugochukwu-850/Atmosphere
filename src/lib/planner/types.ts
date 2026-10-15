/**
 * Planner view models. The spec types a plan's insides as loose objects, so
 * src/lib/data/planner.ts fills every default once and components never read
 * raw API data. Field names were mapped from the demo site's planner bundle.
 */

/** Shoot kinds the planner classifies a brief into, with display labels. */
export const SHOOT_KINDS = {
  music_video: "Music video",
  interview: "Interview / talking head",
  commercial: "Commercial",
  documentary: "Documentary",
  fashion: "Fashion / stills",
  narrative: "Narrative / short",
  concert: "Live performance",
  general: "General production",
} as const;

export type ShootKind = keyof typeof SHOOT_KINDS;

/** Professional kit the brief calls for, listed even when nobody rents it yet. */
export type KitNeed = {
  id: string;
  name: string;
  purpose: string;
  /** Something matching is listed on ArtMostSphere. */
  inCatalog: boolean;
};

export type SuggestionKind =
  "location" | "pin" | "gear" | "gear_sale" | "talent" | "other";

/** A catalog row the planner matched to the brief. */
export type PlanSuggestion = {
  id: string;
  kind: SuggestionKind;
  title: string;
  description: string;
  category: string;
  neighborhood: string;
  city?: string;
  photoUrl?: string;
  dayRateNgn: number;
  salePriceNgn: number;
  /** Cost of this row for the whole plan (day rate × days); 0 when unpriced. */
  lineTotalNgn: number;
  lat?: number;
  lng?: number;
  accessNotes?: string;
};

/** Indicative cost of the catalog rows, split by type. */
export type PlanEstimate = {
  totalNgn: number;
  days: number;
  locationsNgn: number;
  gearNgn: number;
  talentNgn: number;
  note?: string;
};

export type PlanCitation = { id?: string; kind?: string; title: string };

export type Plan = {
  conversationId?: string;
  /** Conversation title (only on saved plans). */
  title?: string;
  /** The first brief of the conversation. */
  brief?: string;
  /** Later messages that refined the plan, oldest first. */
  followUps: string[];
  /** Preferred area sent with the brief. */
  area?: string;
  /** The planner's written answer. */
  reply: string;
  /** Usually a ShootKind; kept as a string in case the API adds kinds. */
  shootKind?: string;
  shots: string[];
  kitNeeds: KitNeed[];
  suggestions: PlanSuggestion[];
  estimate?: PlanEstimate;
  citations: PlanCitation[];
};

export function shootKindLabel(kind: string): string {
  return (
    SHOOT_KINDS[kind as ShootKind] ??
    kind.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

/** True when a plan has nothing to show (e.g. a saved plan we couldn't read). */
export function isEmptyPlan(plan: Plan): boolean {
  return (
    !plan.reply &&
    plan.shots.length === 0 &&
    plan.kitNeeds.length === 0 &&
    plan.suggestions.length === 0 &&
    !plan.estimate
  );
}

/**
 * Planner data: create a plan and load a saved one.
 *
 * The spec types a plan's insides as loose objects, so everything goes through
 * the normalizers below (every field optional, arrays default to []). Shapes
 * were mapped from the demo site's public planner bundle
 * (/_next/static/chunks/app/planner/page-*.js on web-production-2a05):
 *   kitNeeds     [{ id, name, purpose, inCatalog }]
 *   suggestions  [{ id, kind, title, description, category, neighborhood,
 *                   city, photoUrl, dayRateNgn, lineTotalNgn, lat, lng }]
 *                kind: location | pin | gear | talent (anything else is "other")
 *   estimate     { totalNgn, days, locationsNgn, gearNgn, talentNgn, note }
 *   shots        string[]
 *   shootKind    one of SHOOT_KINDS
 * The bundle doesn't show conversation messages, so a saved plan is read from
 * the last non-user message carrying those fields, directly or nested under a
 * few likely keys.
 */
import { orNull, unwrap } from "@/lib/api/client";
import {
  getV1PlannerConversationsById,
  postV1Planner,
  type PlannerRequest,
} from "@/lib/api/generated";
import type {
  KitNeed,
  Plan,
  PlanCitation,
  PlanEstimate,
  PlanSuggestion,
  SuggestionKind,
} from "@/lib/planner/types";

// ------------------------------------------------------------------ api

/** POST /v1/planner: a new plan, or a follow-up when `conversationId` is set. */
export async function createPlan(
  token: string,
  body: PlannerRequest,
): Promise<Plan> {
  const data = await unwrap(postV1Planner({ auth: token, body }));
  return {
    ...toPlan(data.result),
    conversationId: text(data.conversationId) || undefined,
    area: body.area,
    ...(body.conversationId
      ? { followUps: [body.idea] }
      : { brief: body.idea, followUps: [] }),
  };
}

/** GET /v1/planner/conversations/{id}: null when it doesn't exist. */
export async function getPlanConversation(
  token: string,
  id: string,
): Promise<Plan | null> {
  const data = await orNull(
    unwrap(getV1PlannerConversationsById({ auth: token, path: { id } })),
  );
  return isObj(data?.conversation) ? toSavedPlan(data.conversation, id) : null;
}

// --------------------------------------------------------- normalizers

type Obj = Record<string, unknown>;

const isObj = (value: unknown): value is Obj =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const present = <T>(value: T | null): value is T => value !== null;

/** First non-empty string among the candidates, trimmed ("" if none). */
function text(...candidates: unknown[]): string {
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function num(value: unknown): number | undefined {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : NaN;
  return Number.isFinite(n) ? n : undefined;
}

const amount = (value: unknown) => Math.max(0, num(value) ?? 0);

function parseJson(value: unknown): Obj | undefined {
  if (typeof value !== "string" || !value.trim().startsWith("{")) return;
  try {
    const parsed: unknown = JSON.parse(value);
    return isObj(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

const SUGGESTION_KINDS: Record<string, SuggestionKind | undefined> = {
  location: "location",
  bookable: "location",
  pin: "pin",
  scout: "pin",
  gear: "gear",
  gear_sale: "gear_sale",
  talent: "talent",
};

function toKitNeed(raw: unknown, index: number): KitNeed | null {
  if (typeof raw === "string") {
    const name = raw.trim();
    return name
      ? { id: `kit-${index}`, name, purpose: "", inCatalog: false }
      : null;
  }
  if (!isObj(raw)) return null;
  const name = text(raw.name, raw.title, raw.item, raw.label);
  if (!name) return null;
  return {
    id: text(raw.id) || `kit-${index}`,
    name,
    purpose: text(raw.purpose, raw.reason, raw.why, raw.description),
    inCatalog: raw.inCatalog === true || raw.inCatalog === "true",
  };
}

function toSuggestion(raw: unknown): PlanSuggestion | null {
  if (!isObj(raw)) return null;
  const id = text(raw.id, raw.listingId, raw.pinId);
  const title = text(raw.title, raw.name);
  if (!id || !title) return null;
  return {
    id,
    kind: SUGGESTION_KINDS[text(raw.kind, raw.type).toLowerCase()] ?? "other",
    title,
    description: text(raw.description, raw.summary),
    category: text(raw.category),
    neighborhood: text(raw.neighborhood),
    city: text(raw.city) || undefined,
    photoUrl: text(raw.photoUrl) || undefined,
    dayRateNgn: amount(raw.dayRateNgn),
    salePriceNgn: amount(raw.salePriceNgn),
    lineTotalNgn: amount(raw.lineTotalNgn),
    lat: num(raw.lat),
    lng: num(raw.lng),
    accessNotes: text(raw.accessNotes) || undefined,
  };
}

/** Drop repeated rows so React keys stay unique. */
function uniqueSuggestions(rows: PlanSuggestion[]): PlanSuggestion[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = `${row.kind}:${row.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toEstimate(raw: unknown): PlanEstimate | undefined {
  if (!isObj(raw)) return undefined;
  const locationsNgn = amount(raw.locationsNgn);
  const gearNgn = amount(raw.gearNgn);
  const talentNgn = amount(raw.talentNgn);
  const estimate: PlanEstimate = {
    totalNgn: amount(raw.totalNgn) || locationsNgn + gearNgn + talentNgn,
    days: Math.round(amount(raw.days)),
    locationsNgn,
    gearNgn,
    talentNgn,
    note: text(raw.note) || undefined,
  };
  // Nothing priced and nothing to say: no estimate worth a tab.
  return estimate.totalNgn || estimate.days || estimate.note
    ? estimate
    : undefined;
}

function toShots(raw: unknown): string[] {
  return list(raw)
    .map((shot) =>
      isObj(shot)
        ? text(shot.title, shot.name, shot.description, shot.shot)
        : text(shot),
    )
    .filter(Boolean);
}

function toCitation(raw: unknown): PlanCitation | null {
  if (typeof raw === "string") return raw.trim() ? { title: raw.trim() } : null;
  if (!isObj(raw)) return null;
  const title = text(raw.title, raw.name, raw.label, raw.source);
  if (!title) return null;
  return {
    id: text(raw.id) || undefined,
    kind: text(raw.kind, raw.type) || undefined,
    title,
  };
}

/** `result` of POST /v1/planner (or the same fields on a saved message). */
function toPlan(raw: unknown): Plan {
  const r = isObj(raw) ? raw : {};
  return {
    reply: text(r.reply),
    shootKind: text(r.shootKind) || undefined,
    shots: toShots(r.shots),
    kitNeeds: list(r.kitNeeds).map(toKitNeed).filter(present),
    suggestions: uniqueSuggestions(
      list(r.suggestions).map(toSuggestion).filter(present),
    ),
    estimate: toEstimate(r.estimate),
    citations: list(r.citations).map(toCitation).filter(present),
    followUps: [],
  };
}

// ----------------------------------------------------- saved conversations

const PLAN_KEYS = ["suggestions", "kitNeeds", "estimate", "shots", "shootKind"];
const hasPlanFields = (o: Obj) => PLAN_KEYS.some((key) => key in o);

const role = (message: Obj) =>
  text(message.role, message.author, message.sender).toLowerCase();
const isUser = (message: Obj) => ["user", "human"].includes(role(message));

/** Plan fields on a message: inline, nested, or as JSON in its content. */
function planFields(message: Obj): Obj | undefined {
  const nested = [
    message.result,
    message.plan,
    message.meta,
    message.metadata,
    message.data,
    message.payload,
  ].find((value): value is Obj => isObj(value) && hasPlanFields(value));
  if (nested) return nested;
  if (hasPlanFields(message)) return message;
  const parsed = parseJson(message.content);
  return parsed && hasPlanFields(parsed) ? parsed : undefined;
}

/** Readable text of a message (string, content parts, or a JSON payload). */
function messageText(message: Obj): string {
  const parts = list(message.content)
    .map((part) => (isObj(part) ? text(part.text) : text(part)))
    .filter(Boolean);
  const raw = parts.length
    ? parts.join("\n\n")
    : text(message.content, message.text, message.body, message.message);
  const parsed = parseJson(raw);
  return parsed ? text(parsed.reply, parsed.idea, parsed.text) : raw;
}

function toSavedPlan(conversation: Obj, id: string): Plan {
  const messages = list(conversation.messages).filter(isObj);
  const briefs = messages.filter(isUser).map(messageText).filter(Boolean);
  const answers = messages.filter((m) => !isUser(m));
  const answer =
    answers.findLast((m) => planFields(m) !== undefined) ?? answers.at(-1);
  const fields = answer ? planFields(answer) : undefined;
  const plan = toPlan(fields);

  return {
    ...plan,
    reply: plan.reply || (answer ? messageText(answer) : ""),
    conversationId: text(conversation.id) || id,
    title: text(conversation.title) || undefined,
    brief: briefs[0],
    followUps: briefs.slice(1),
    area: text(conversation.area, fields?.area) || undefined,
  };
}

import type {
  AccountUser,
  BookingSummary as ApiBookingSummary,
  CastCallListed,
  ListingCard,
  PlacePin,
  PublicUser,
} from "@/lib/api/generated";

import type {
  Account,
  BookingSummary,
  CastingCall,
  CatalogItem,
  FeedPost,
  ItemKind,
  Person,
  ScoutPin,
} from "./types";

const KINDS: readonly ItemKind[] = ["location", "gear", "gear_sale", "talent"];

const opt = <T>(value: T | null | undefined): T | undefined =>
  value ?? undefined;

export function toItem(card: ListingCard): CatalogItem {
  return {
    id: card.id ?? "",
    kind: KINDS.includes(card.kind as ItemKind)
      ? (card.kind as ItemKind)
      : "location",
    title: card.title ?? "Untitled",
    description: card.description ?? "",
    category: card.category ?? "",
    neighborhood: card.neighborhood ?? "",
    city: card.city ?? "",
    state: card.state ?? "",
    lat: opt(card.lat),
    lng: opt(card.lng),
    distanceKm: opt(card.distanceKm),
    dayRateNgn: card.dayRateNgn ?? 0,
    salePriceNgn: card.salePriceNgn ?? 0,
    status: card.status ?? "published",
    photoUrl: opt(card.photoUrl),
    serialNumber: opt(card.serialNumber),
    accessories: card.accessories || undefined,
  };
}

/** Specialties arrive as a comma-separated string. */
function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

type AnyUser = PublicUser & {
  socialAccounts?: {
    platform?: string;
    handle?: string;
    url?: string;
    showFeed?: boolean;
  }[];
};

/** `profile` is an untyped object in the spec; read known string fields safely. */
function profileField(
  user: AnyUser,
  key: "bio" | "neighborhood" | "specialties",
): string | undefined {
  const value = (user.profile as Record<string, unknown> | null | undefined)?.[
    key
  ];
  return typeof value === "string" && value ? value : undefined;
}

export function toPerson(user: AnyUser): Person {
  return {
    id: user.id ?? "",
    name: user.name ?? "Unknown",
    phone: opt(user.phone),
    bio: profileField(user, "bio"),
    neighborhood: profileField(user, "neighborhood"),
    specialties: splitList(profileField(user, "specialties")),
    socials: (user.socialAccounts ?? [])
      .filter((s) => s.platform && s.handle)
      .map((s) => ({
        platform: s.platform!,
        handle: s.handle!,
        url: s.url,
        showFeed: Boolean(s.showFeed),
      })),
  };
}

export function toAccount(user: AccountUser): Account {
  return {
    ...toPerson(user),
    email: user.email ?? "",
    roles: user.roles ?? [],
  };
}

type Json = Record<string, unknown>;

const isObject = (value: unknown): value is Json =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** First non-empty string among `keys`. */
function pick(obj: Json, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
}

const https = (url?: string) =>
  url && /^https:\/\//i.test(url) ? url : undefined;

/** The post list wherever it sits: a bare array, or under posts/items/feed/data. */
function postList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!isObject(data)) return [];
  for (const key of ["posts", "items", "feed", "data"]) {
    const list = postList(data[key]);
    if (list.length > 0) return list;
  }
  return [];
}

/**
 * GET /v1/users/{id}/feed is typed as `Ok` in the spec and no seeded profile
 * has a linked account, so the real body could not be observed. Read the
 * common field names defensively; posts without a link or text are dropped.
 */
export function toFeed(data: unknown): FeedPost[] {
  return postList(data)
    .filter(isObject)
    .map((post, i) => {
      const url = https(pick(post, ["url", "permalink", "link", "href"]));
      const postedAt = pick(post, [
        "publishedAt",
        "postedAt",
        "createdAt",
        "timestamp",
        "date",
      ]);
      return {
        id: pick(post, ["id", "postId"]) ?? url ?? String(i),
        url,
        caption: pick(post, ["caption", "title", "text", "description"]),
        imageUrl: https(
          pick(post, [
            "thumbnailUrl",
            "thumbnail_url",
            "thumbnail",
            "imageUrl",
            "image",
            "mediaUrl",
            "media_url",
          ]),
        ),
        postedAt:
          postedAt && !Number.isNaN(Date.parse(postedAt))
            ? postedAt
            : undefined,
      };
    })
    .filter((post) => post.url || post.caption);
}

// The API also returns photoUrl and city on pins (not in the spec yet).
export function toPin(
  pin: PlacePin & { photoUrl?: string | null; city?: string },
): ScoutPin | null {
  if (pin.lat === undefined || pin.lng === undefined || !pin.id) return null;
  return {
    id: pin.id,
    title: pin.title ?? "Untitled",
    description: pin.description ?? "",
    category: pin.category ?? "",
    neighborhood: pin.neighborhood ?? "",
    city: pin.city || undefined,
    lat: pin.lat,
    lng: pin.lng,
    accessNotes: pin.accessNotes || undefined,
    photoUrl: opt(pin.photoUrl),
  };
}

export function toCall(call: CastCallListed & { city?: string }): CastingCall {
  return {
    id: call.id ?? "",
    title: call.title ?? "Untitled call",
    brief: call.description ?? "",
    roleNeeded: call.roleNeeded ?? "actor",
    neighborhood: call.neighborhood ?? "",
    city: call.city,
    shootDate: opt(call.shootDate),
    status: call.status ?? "open",
    applications: call.applications,
    owner: call.owner ? toPerson(call.owner) : undefined,
  };
}

export function toBooking(b: ApiBookingSummary): BookingSummary {
  return {
    id: b.id ?? "",
    status: b.status ?? "requested",
    totalNgn: b.totalNgn ?? 0,
    startDate: b.startDate ?? "",
    endDate: b.endDate ?? "",
    item: b.listing ? toItem(b.listing) : undefined,
    renter: b.renter ? toPerson(b.renter) : undefined,
    owner: b.owner ? toPerson(b.owner) : undefined,
  };
}

import type {
  BookingSummary as ApiBookingSummary,
  CastCallListed,
  ListingCard,
  PlacePin,
  PublicUser,
} from "@/lib/api/generated";

import type {
  BookingSummary,
  CastingCall,
  CatalogItem,
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

/**
 * View models the UI renders. The backend spec marks every field optional, so
 * normalize.ts fills defaults once here instead of `?.` across components.
 */
export type ItemKind = "location" | "gear" | "gear_sale" | "talent";

export type CatalogItem = {
  id: string;
  kind: ItemKind;
  title: string;
  description: string;
  category: string;
  neighborhood: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  distanceKm?: number;
  dayRateNgn: number;
  salePriceNgn: number;
  status: string;
  photoUrl?: string;
  serialNumber?: string;
  /** Free-text kit contents for gear. */
  accessories?: string;
};

export type Person = {
  id: string;
  name: string;
  phone?: string;
  bio?: string;
  neighborhood?: string;
  specialties: string[];
  socials: {
    platform: string;
    handle: string;
    url?: string;
    showFeed: boolean;
  }[];
};

export type ItemDetail = CatalogItem & { owner?: Person };

export type ScoutPin = {
  id: string;
  title: string;
  description: string;
  category: string;
  neighborhood: string;
  lat: number;
  lng: number;
  accessNotes?: string;
  photoUrl?: string;
};

export type CastingCall = {
  id: string;
  title: string;
  brief: string;
  roleNeeded: string;
  neighborhood: string;
  city?: string;
  shootDate?: string;
  status: string;
  applications?: number;
  owner?: Person;
};

export type BookingSummary = {
  id: string;
  status: string;
  totalNgn: number;
  startDate: string;
  endDate: string;
  item?: CatalogItem;
  renter?: Person;
  owner?: Person;
};

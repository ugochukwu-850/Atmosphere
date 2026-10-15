import { z } from "zod";

import { areaField, blankToUndefined, type Choice } from "./fields";

/** What can be listed. Each kind has its own create endpoint. */
export const LISTING_KINDS = [
  "location",
  "gear",
  "gear_sale",
  "talent",
] as const;
export type ListingKind = (typeof LISTING_KINDS)[number];

/** The account role the API requires to create each kind. */
const KIND_ROLE: Record<ListingKind, "owner" | "talent"> = {
  location: "owner",
  gear: "owner",
  gear_sale: "owner",
  talent: "talent",
};

/** Kinds the user's roles allow, in display order. */
export function kindsForRoles(roles: readonly string[]): ListingKind[] {
  return LISTING_KINDS.filter((kind) => roles.includes(KIND_ROLE[kind]));
}

const GEAR_CATEGORIES: Choice[] = [
  { value: "camera", label: "Camera" },
  { value: "lens", label: "Lens" },
  { value: "lighting", label: "Lighting" },
  { value: "audio", label: "Audio" },
  { value: "grip", label: "Grip" },
];

/** Cast and crew roles, shared with casting calls. */
export const TALENT_CATEGORIES: Choice[] = [
  { value: "actor", label: "Actor" },
  { value: "model", label: "Model" },
  { value: "dp", label: "DP / cinematographer" },
  { value: "voice over", label: "Voice over" },
  { value: "sound", label: "Sound" },
  { value: "makeup", label: "Makeup" },
];

/** Suggested categories per kind (the same values the catalog filters use). */
export const CATEGORY_CHOICES: Record<ListingKind, Choice[]> = {
  location: [
    { value: "studio", label: "Studio" },
    { value: "stage", label: "Stage" },
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "gallery", label: "Gallery" },
    { value: "landmark", label: "Landmark" },
    { value: "beach", label: "Beach" },
    { value: "park", label: "Park" },
  ],
  gear: GEAR_CATEGORIES,
  gear_sale: GEAR_CATEGORIES,
  talent: TALENT_CATEGORIES,
};

export const MAX_DAY_RATE_NGN = 50_000_000;

/** "₦150,000" → 150000. Anything that isn't whole naira becomes NaN. */
function naira(value: unknown) {
  if (typeof value !== "string" || value === "") return undefined;
  const digits = value.replace(/[₦,\s]/g, "");
  return /^\d+$/.test(digits) ? Number(digits) : Number.NaN;
}

/** Hidden pin inputs: "" when no pin was dropped. */
const coordinate = (min: number, max: number) =>
  z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    z.number().gte(min).lte(max).optional(),
  );

const optionalText = (max: number, message: string) =>
  z.preprocess(blankToUndefined, z.string().max(max, message).optional());

/** Parsed first: the rest of the schema depends on the kind. */
export const listingKindSchema = z.object({
  kind: z.enum(LISTING_KINDS, { error: "Choose what you're listing." }),
});

/**
 * CreateListingRequest / CreateGearSaleRequest limits, on raw form strings.
 * `price` becomes dayRateNgn, or salePriceNgn for gear for sale.
 */
export function listingSchema(kind: ListingKind) {
  const price = z
    .number({ error: "Enter the price in whole naira, like 150000." })
    .int("Enter the price in whole naira, like 150000.")
    .positive("The price must be more than ₦0.");

  return z.object({
    title: z
      .string()
      .min(3, "Give it a title (3+ characters).")
      .max(120, "Keep the title to 120 characters."),
    description: z
      .string()
      .min(12, "Describe it in a sentence or two (12+ characters).")
      .max(4000, "Keep the description to 4,000 characters."),
    category: z
      .string()
      .min(2, "Pick a category, or type your own (2+ characters).")
      .max(80, "Keep the category to 80 characters."),
    area: areaField("Choose the city (or state) it's in."),
    neighborhood: z
      .string()
      .min(2, "Add the neighbourhood, like Yaba or Wuse II.")
      .max(80, "Keep the neighbourhood to 80 characters."),
    lat: coordinate(-90, 90),
    lng: coordinate(-180, 180),
    price: z.preprocess(
      naira,
      kind === "gear_sale"
        ? price
        : price.max(MAX_DAY_RATE_NGN, "Day rates go up to ₦50,000,000."),
    ),
    serialNumber: optionalText(80, "Keep the serial number to 80 characters."),
    accessories: optionalText(400, "Keep the kit list to 400 characters."),
  });
}

export type ListingInput = z.output<ReturnType<typeof listingSchema>>;

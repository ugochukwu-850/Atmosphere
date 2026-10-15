"use server";

import { unwrap } from "@/lib/api/client";
import {
  postV1CastTalent,
  postV1Gear,
  postV1GearSale,
  postV1Locations,
} from "@/lib/api/generated";
import { getSessionToken } from "@/lib/auth/session";
import {
  apiErrorMessage,
  fieldErrors,
  str,
  type ActionState,
} from "@/lib/forms";
import { chosen } from "@/lib/validators/fields";
import {
  listingKindSchema,
  listingSchema,
  type ListingInput,
  type ListingKind,
} from "@/lib/validators/listing";

export type ListingFormState = ActionState;

// What a 403 means for each kind: the account lacks the role.
const ROLE_HINT: Record<ListingKind, string> = {
  location:
    "Only owners can list a location. Add the owner role from your account.",
  gear: "Only owners can list gear. Add the owner role from your account.",
  gear_sale: "Only owners can list gear. Add the owner role from your account.",
  talent:
    "Only talent can publish a creator profile. Add the talent role from your account.",
};

// Everything the form posts, echoed back on errors to refill it.
const FIELDS = [
  "kind",
  "title",
  "description",
  "categoryChoice",
  "categoryOther",
  "area",
  "neighborhood",
  "lat",
  "lng",
  "price",
  "serialNumber",
  "accessories",
] as const;

/**
 * "List something": a location, gear for rent or sale, or a creator profile.
 * New listings wait for admin review, so success returns the id for a link
 * rather than redirecting to a page that isn't public yet.
 */
export async function createListingAction(
  _prev: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const values = Object.fromEntries(FIELDS.map((k) => [k, str(formData, k)]));
  const token = await getSessionToken();
  if (!token) return { values, error: "Your session expired. Sign in again." };

  const picked = listingKindSchema.safeParse(values);
  if (!picked.success) {
    return { values, fieldErrors: fieldErrors(picked.error) };
  }
  const { kind } = picked.data;

  const parsed = listingSchema(kind).safeParse({
    ...values,
    category: chosen(formData, "category"),
  });
  if (!parsed.success) {
    return { values, fieldErrors: fieldErrors(parsed.error) };
  }

  try {
    const { listing } = await createListing(kind, token, parsed.data);
    return { ok: true, id: listing?.id };
  } catch (err) {
    return { values, error: apiErrorMessage(err, { 403: ROLE_HINT[kind] }) };
  }
}

function createListing(kind: ListingKind, token: string, data: ListingInput) {
  const { area, lat, lng, price, serialNumber, accessories, ...text } = data;
  const pinned = lat !== undefined && lng !== undefined;
  const body = {
    ...text,
    city: area.city,
    state: area.state,
    // Without a pin, use the area's centre: the API would otherwise put the
    // listing in central Lagos, wherever it really is.
    lat: pinned ? lat : area.lat,
    lng: pinned ? lng : area.lng,
  };
  const kit = { ...body, serialNumber, accessories };

  switch (kind) {
    case "location":
      return unwrap(
        postV1Locations({ auth: token, body: { ...body, dayRateNgn: price } }),
      );
    case "gear":
      return unwrap(
        postV1Gear({ auth: token, body: { ...kit, dayRateNgn: price } }),
      );
    case "gear_sale":
      return unwrap(
        postV1GearSale({ auth: token, body: { ...kit, salePriceNgn: price } }),
      );
    case "talent":
      return unwrap(
        postV1CastTalent({ auth: token, body: { ...body, dayRateNgn: price } }),
      );
  }
}

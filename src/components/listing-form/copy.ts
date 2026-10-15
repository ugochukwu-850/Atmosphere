import type { ListingKind } from "@/lib/validators/listing";

/** Labels and hints per listing kind (no Figma frame; tone follows the detail pages). */
export const KIND_COPY: Record<
  ListingKind,
  {
    /** Radio card. */
    label: string;
    blurb: string;
    /** "Your location is in the review queue." */
    noun: string;
    detailsTitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    categoryLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    priceLabel: string;
    pricePlaceholder: string;
    whereTitle: string;
    /** Finishes "Click the map to pin …". */
    pinWhat: string;
    neighborhoodPlaceholder: string;
    /** Where it shows once approved. */
    live: string;
    href: (id: string) => string;
  }
> = {
  location: {
    label: "Location",
    blurb: "A studio, home or outdoor space crews can book by the day.",
    noun: "location",
    detailsTitle: "About the space",
    titleLabel: "Listing title",
    titlePlaceholder: "Sunlit loft studio with cyc wall",
    categoryLabel: "Type of space",
    descriptionLabel: "Description",
    descriptionPlaceholder:
      "Size, light, power, parking, access hours and house rules",
    priceLabel: "Day rate (₦)",
    pricePlaceholder: "150000",
    whereTitle: "Where it is",
    pinWhat: "the entrance",
    neighborhoodPlaceholder: "Yaba, Lekki Phase 1, Wuse II",
    live: "in Locations and on the map",
    href: (id) => `/listings/${id}`,
  },
  gear: {
    label: "Gear for rent",
    blurb: "Cameras, lenses, lights or sound kit, rented by the day.",
    noun: "gear listing",
    detailsTitle: "About the kit",
    titleLabel: "Listing title",
    titlePlaceholder: "Sony FX6 cinema kit",
    categoryLabel: "Category",
    descriptionLabel: "Description",
    descriptionPlaceholder:
      "Condition, what it suits, deposit, pickup and return terms",
    priceLabel: "Day rate (₦)",
    pricePlaceholder: "45000",
    whereTitle: "Pickup point",
    pinWhat: "where crews collect it",
    neighborhoodPlaceholder: "Ikeja GRA, Surulere, Garki",
    live: "in Gear",
    href: (id) => `/listings/${id}`,
  },
  gear_sale: {
    label: "Gear for sale",
    blurb: "Kit you want to sell outright.",
    noun: "gear listing",
    detailsTitle: "About the kit",
    titleLabel: "Listing title",
    titlePlaceholder: "Canon C70 body, low hours",
    categoryLabel: "Category",
    descriptionLabel: "Description",
    descriptionPlaceholder:
      "Condition, age, hours or shutter count, why selling",
    priceLabel: "Asking price (₦)",
    pricePlaceholder: "1850000",
    whereTitle: "Where buyers can see it",
    pinWhat: "where buyers can view it",
    neighborhoodPlaceholder: "Ikeja GRA, Surulere, Garki",
    live: "in Gear for sale",
    href: (id) => `/listings/${id}`,
  },
  talent: {
    label: "Creator profile",
    blurb: "Your profile as cast or crew, hired by the day.",
    noun: "profile",
    detailsTitle: "About you",
    titleLabel: "Profile title",
    titlePlaceholder: "Lagos-based actor and voice artist",
    categoryLabel: "What you do",
    descriptionLabel: "About you",
    descriptionPlaceholder:
      "Credits, training, languages and the work you do best",
    priceLabel: "Day rate (₦)",
    pricePlaceholder: "80000",
    whereTitle: "Where you're based",
    pinWhat: "where you're based",
    neighborhoodPlaceholder: "Yaba, Lekki Phase 1, Wuse II",
    live: "on the talent board",
    href: (id) => `/cast/talent/${id}`,
  },
};

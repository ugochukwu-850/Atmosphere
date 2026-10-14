/** Cities the catalog covers (mirrors GET /v1/catalog/places). Coordinates are city centres. */
export type City = {
  slug: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  /** Metro fence used by the API for city-scoped search. */
  radiusKm: number;
};

export const CITIES: readonly City[] = [
  { slug: "lagos", name: "Lagos", state: "Lagos", lat: 6.5244, lng: 3.3792, radiusKm: 55 },
  { slug: "abuja", name: "Abuja", state: "FCT", lat: 9.0765, lng: 7.3986, radiusKm: 40 },
  { slug: "port-harcourt", name: "Port Harcourt", state: "Rivers", lat: 4.8156, lng: 7.0498, radiusKm: 35 },
  { slug: "kano", name: "Kano", state: "Kano", lat: 12.0022, lng: 8.592, radiusKm: 30 },
  { slug: "ibadan", name: "Ibadan", state: "Oyo", lat: 7.3775, lng: 3.947, radiusKm: 30 },
  { slug: "enugu", name: "Enugu", state: "Enugu", lat: 6.4584, lng: 7.5464, radiusKm: 25 },
  { slug: "kaduna", name: "Kaduna", state: "Kaduna", lat: 10.5105, lng: 7.4165, radiusKm: 30 },
  { slug: "benin-city", name: "Benin City", state: "Edo", lat: 6.335, lng: 5.6037, radiusKm: 25 },
  { slug: "calabar", name: "Calabar", state: "Cross River", lat: 4.9757, lng: 8.3417, radiusKm: 25 },
  { slug: "jos", name: "Jos", state: "Plateau", lat: 9.8965, lng: 8.8583, radiusKm: 25 },
  { slug: "uyo", name: "Uyo", state: "Akwa Ibom", lat: 5.0377, lng: 7.9128, radiusKm: 20 },
  { slug: "owerri", name: "Owerri", state: "Imo", lat: 5.4836, lng: 7.0333, radiusKm: 20 },
  { slug: "abeokuta", name: "Abeokuta", state: "Ogun", lat: 7.1475, lng: 3.3619, radiusKm: 25 },
  { slug: "ilorin", name: "Ilorin", state: "Kwara", lat: 8.4966, lng: 4.5426, radiusKm: 25 },
  { slug: "warri", name: "Warri", state: "Delta", lat: 5.516, lng: 5.75, radiusKm: 25 },
  { slug: "asaba", name: "Asaba", state: "Delta", lat: 6.198, lng: 6.7319, radiusKm: 20 },
  { slug: "onitsha", name: "Onitsha", state: "Anambra", lat: 6.145, lng: 6.785, radiusKm: 20 },
  { slug: "awka", name: "Awka", state: "Anambra", lat: 6.21, lng: 7.07, radiusKm: 20 },
  { slug: "makurdi", name: "Makurdi", state: "Benue", lat: 7.7322, lng: 8.5391, radiusKm: 20 },
  { slug: "maiduguri", name: "Maiduguri", state: "Borno", lat: 11.8311, lng: 13.151, radiusKm: 25 },
];

export const STATES: readonly string[] = [...new Set(CITIES.map((c) => c.state))].sort();

/** Rough centre of Nigeria, used when no area is set. */
export const NIGERIA_CENTER = { lat: 9.082, lng: 8.6753 } as const;

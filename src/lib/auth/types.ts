export type SessionUser = {
  id: string;
  name: string;
  email: string;
  /** "renter" | "owner" | "talent" | "admin" (the API types these as plain strings). */
  roles: string[];
};

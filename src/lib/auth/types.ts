import type { Role } from "@/lib/validators/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  roles: Role[];
};

/** Shape the backend returns from login and register. */
export type AuthResponse = { token: string; user: SessionUser };

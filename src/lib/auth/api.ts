import { apiFetch } from "@/lib/api/client";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth";

import type { AuthResponse, SessionUser } from "./types";

// TODO: confirm endpoint paths and payloads against the backend OpenAPI spec.
export const authApi = {
  login: (input: LoginInput) =>
    apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(input) }),
  register: (input: RegisterInput) =>
    apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(input) }),
  me: (token: string) => apiFetch<SessionUser>("/auth/me", { token }),
};

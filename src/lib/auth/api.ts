import { unwrap } from "@/lib/api/client";
import { getCurrentUser, login, register } from "@/lib/api/generated";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth";

export const authApi = {
  login: (body: LoginInput) => unwrap(login({ body })),
  register: (body: RegisterInput) => unwrap(register({ body })),
  me: (token: string) => unwrap(getCurrentUser({ auth: token })),
};

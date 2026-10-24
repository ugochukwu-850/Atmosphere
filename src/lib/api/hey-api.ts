import { env } from "@/lib/env";

import type { CreateClientConfig } from "./generated/client.gen";

/** Runtime config for the generated client (see openapi-ts.config.ts). */
export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: env.NEXT_PUBLIC_API_URL,
});

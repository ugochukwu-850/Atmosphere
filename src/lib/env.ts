import { z } from "zod";

/**
 * Public (client-exposed) environment variables.
 *
 * NEXT_PUBLIC_* values are inlined at build time, so each one must be
 * referenced explicitly (process.env.NEXT_PUBLIC_X), not via a dynamic lookup.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = parsed.data;
export type Env = z.infer<typeof publicEnvSchema>;

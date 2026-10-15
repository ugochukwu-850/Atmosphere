import { z } from "zod";

import { ROLES } from "./auth";

/** Platforms PUT /v1/users/me/social accepts, in form order. */
export const SOCIAL_PLATFORMS = [
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "facebook",
  "vimeo",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  facebook: "Facebook",
  vimeo: "Vimeo",
};

export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return SOCIAL_PLATFORMS.includes(value as SocialPlatform);
}

// Limits mirror PATCH /v1/users/me so errors show on the field, not as a 400.
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid phone number")
    .max(24, "Enter a valid phone number"),
  neighborhood: z.string().trim().max(80, "Use 80 characters or fewer"),
  specialties: z.string().trim().max(200, "Use 200 characters or fewer"),
  bio: z.string().trim().max(2000, "Use 2,000 characters or fewer"),
});

export const roleSchema = z.enum(ROLES, "Pick a role to add");

const handleSchema = z
  .string()
  .trim()
  .max(100, "Use 100 characters or fewer")
  .regex(/^\S*$/, "Handles can't contain spaces");

/** One handle per platform ("" = not linked) and the platform whose feed shows. */
export const socialsSchema = z
  .object({
    ...(Object.fromEntries(
      SOCIAL_PLATFORMS.map((platform) => [platform, handleSchema]),
    ) as Record<SocialPlatform, typeof handleSchema>),
    showFeed: z.union([z.enum(SOCIAL_PLATFORMS), z.literal("")]),
  })
  .superRefine((value, ctx) => {
    if (value.showFeed && !value[value.showFeed]) {
      ctx.addIssue({
        code: "custom",
        path: [value.showFeed],
        message: "Add a handle to show this feed",
      });
    }
  });

export type ProfileInput = z.infer<typeof profileSchema>;

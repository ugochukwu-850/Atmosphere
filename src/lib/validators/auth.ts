import { z } from "zod";

export const ROLES = ["renter", "owner", "creator"] as const;
export type Role = (typeof ROLES)[number] | "admin" | "ops";

export const ROLE_LABELS: Record<(typeof ROLES)[number], string> = {
  renter: "Renter",
  owner: "Owner (list locations and gear)",
  creator: "Creator / cast",
};

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{10,15}$/, "Enter a valid phone number"),
  password: z.string().min(8, "Use at least 8 characters"),
  roles: z.array(z.enum(ROLES)).min(1, "Pick at least one role"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

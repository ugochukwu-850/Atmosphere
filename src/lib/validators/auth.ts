import { z } from "zod";

export const ROLES = ["renter", "owner", "talent"] as const;
export type Role = (typeof ROLES)[number] | "admin";

export const ROLE_OPTIONS: Record<
  (typeof ROLES)[number],
  { title: string; description: string }
> = {
  renter: {
    title: "Book & rent",
    description: "Find locations, rent gear and hire talent.",
  },
  owner: {
    title: "List spaces & gear",
    description: "Earn from your studio, location or kit.",
  },
  talent: {
    title: "Get hired",
    description: "Show your work as cast or crew.",
  },
};

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid phone number")
    .max(24, "Enter a valid phone number"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Use 72 characters or fewer"),
  roles: z.array(z.enum(ROLES)).min(1, "Pick at least one role"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

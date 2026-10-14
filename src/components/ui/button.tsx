import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Variants and sizes measured from the Figma frames (6px radius, Manrope medium).
const variants = {
  /** Product Rust: "Sign In", "Explore", "View details", "Request to book". */
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  /** Secondary Action olive: "Request a booking", "Contact Venue". */
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
  /** "Back to all places", pagination. */
  outline:
    "border border-charcoal/25 bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  /** "Become a provider" on the hero photo. */
  glass:
    "border border-white/15 bg-black/55 text-white backdrop-blur-sm hover:bg-black/70",
  white: "bg-white text-charcoal hover:bg-ivory",
} as const;

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm",
  /** "Plan a shoot", "Become A Provider", "Explore" (259×68 in the frames). */
  xl: "h-[68px] min-w-[259px] px-10 text-base",
  icon: "size-10",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

type StyleProps = { variant?: ButtonVariant; size?: ButtonSize };

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: StyleProps & { className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap transition-colors",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & StyleProps) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props} />
  );
}

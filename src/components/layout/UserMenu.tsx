import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

const MENU = [
  { href: "/bookings", label: "Bookings" },
  { href: "/list", label: "List something" },
  { href: "/account", label: "Account" },
] as const;

/** Avatar + chevron (Figma header) when signed in; "Sign In" otherwise. */
export async function UserMenu({
  signInClassName,
}: { signInClassName?: string } = {}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <ButtonLink href="/login" size="md" className={cn(signInClassName)}>
        Sign In
      </ButtonLink>
    );
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <details className="relative">
      <summary
        aria-label="Account menu"
        className="flex cursor-pointer list-none items-center gap-2"
      >
        <span className="grid size-10 place-items-center rounded-full bg-[#d9d9d9] text-xs font-semibold text-charcoal">
          {initials}
        </span>
        <ChevronDown className="size-4 opacity-70" />
      </summary>
      <div className="absolute right-0 z-50 mt-3 flex w-52 flex-col rounded-xl border bg-popover p-1.5 text-sm text-popover-foreground shadow-xl">
        <p className="truncate px-3 py-2 text-xs text-muted-foreground">
          {user.email}
        </p>
        <Link
          href={`/people/${user.id}`}
          className="rounded-sm px-3 py-2 hover:bg-muted"
        >
          Profile
        </Link>
        {MENU.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-sm px-3 py-2 hover:bg-muted"
          >
            {item.label}
          </Link>
        ))}
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-sm px-3 py-2 text-left hover:bg-muted"
          >
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}

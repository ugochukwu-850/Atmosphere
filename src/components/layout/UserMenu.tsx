import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

const MENU = [
  { href: "/bookings", label: "Bookings" },
  { href: "/list", label: "List" },
  { href: "/account", label: "Account" },
] as const;

export async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <ButtonLink href="/login" variant="light" size="sm">
        Sign in
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
        className="flex cursor-pointer list-none items-center gap-2 rounded-full py-1 pr-3 pl-1 hover:bg-white/10"
      >
        <span className="grid size-7 place-items-center rounded-full bg-gold text-xs font-semibold text-ink">
          {initials}
        </span>
        <span className="hidden text-sm md:inline">{user.name}</span>
      </summary>
      <div className="absolute right-0 mt-2 flex w-48 flex-col rounded-lg border bg-popover p-1 text-sm text-popover-foreground shadow-lg">
        <Link
          href={`/people/${user.id}`}
          className="rounded-md px-3 py-2 hover:bg-muted"
        >
          Profile
        </Link>
        {MENU.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 hover:bg-muted"
          >
            {item.label}
          </Link>
        ))}
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-left hover:bg-muted"
          >
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}

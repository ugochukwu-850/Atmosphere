"use client";

import { Plus } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/workspace/WorkspacePage";
import { addRoleAction } from "@/lib/account/actions";
import type { ActionState } from "@/lib/forms";
import { titleCase } from "@/lib/format";
import { ROLE_OPTIONS, ROLES } from "@/lib/validators/auth";

type AddableRole = (typeof ROLES)[number];

/** Roles panel: current roles as badges, one card per role still to add. */
export function RolesForm({ roles }: { roles: string[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    addRoleAction,
    {},
  );
  const missing = ROLES.filter((role) => !roles.includes(role));
  const added = state.ok && state.values?.role;

  return (
    <div className="flex flex-col gap-6">
      {roles.length > 0 ? (
        <ul aria-label="Your roles" className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <li key={role}>
              <Badge>{titleCase(role)}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No roles yet.</p>
      )}

      {missing.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-muted-foreground">
            Add a role
          </p>
          {missing.map((role) => (
            <form key={role} action={action}>
              <input type="hidden" name="role" value={role} />
              <RoleCard role={role} disabled={pending} />
            </form>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          You can book, list and get hired on ArtMostSphere.
        </p>
      )}

      {state.error && <Notice tone="error">{state.error}</Notice>}
      {added && !pending && (
        <Notice tone="success">
          {titleCase(added)} role added.{" "}
          {ROLE_OPTIONS[added as AddableRole]?.description}
        </Notice>
      )}
    </div>
  );
}

/** Same card as the sign-up role picker, as a submit button. */
function RoleCard({
  role,
  disabled,
}: {
  role: AddableRole;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  const option = ROLE_OPTIONS[role];
  return (
    <button
      type="submit"
      disabled={disabled}
      className="group flex w-full cursor-pointer items-start gap-4 rounded-md border bg-card p-4 text-left transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:cursor-default disabled:opacity-50"
    >
      <span
        aria-hidden
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-xs border border-charcoal/25 text-primary group-hover:border-primary dark:border-white/30"
      >
        <Plus className="size-3.5" strokeWidth={3} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold">
          <span className="sr-only">Add role: </span>
          {option.title}
        </span>
        <span className="text-xs text-muted-foreground">
          {pending ? "Adding…" : option.description}
        </span>
      </span>
    </button>
  );
}

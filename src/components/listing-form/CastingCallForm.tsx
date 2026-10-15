"use client";

import { useActionState } from "react";

import { encodeArea } from "@/components/search/AreaSelect";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice, Panel } from "@/components/workspace/WorkspacePage";
import type { Area } from "@/lib/area/area";
import { createCallAction, type CallFormState } from "@/lib/casting/actions";
import { ROLE_CHOICES } from "@/lib/validators/casting";
import { OTHER_CHOICE } from "@/lib/validators/fields";

import { ChoiceField } from "./ChoiceField";
import { PlaceFields } from "./PlaceFields";
import { keepValuesOnSubmit } from "./submit";

/** "Post a casting call". On success the action redirects to /cast/calls. */
export function CastingCallForm({
  defaultArea,
  today,
}: {
  /** The visitor's production area, to preselect the city. */
  defaultArea: Area;
  /** YYYY-MM-DD in Lagos: the earliest shoot date. */
  today: string;
}) {
  const [state, action, pending] = useActionState<CallFormState, FormData>(
    createCallAction,
    {},
  );
  const values = state.values ?? {};
  const err = (key: string) => state.fieldErrors?.[key]?.[0];
  // Refill after a submit without JS; a fresh form starts on "actor".
  const role = !state.values
    ? "actor"
    : values.roleNeededChoice === OTHER_CHOICE
      ? values.roleNeededOther
      : values.roleNeededChoice;

  return (
    <form
      action={action}
      onSubmit={keepValuesOnSubmit(action)}
      noValidate
      className="flex flex-col gap-8"
    >
      <Panel title="The role">
        <Field label="Call title" htmlFor="title" error={err("title")}>
          <Input
            id="title"
            name="title"
            defaultValue={values.title}
            placeholder="Lead for a dusk-to-dawn music video"
            maxLength={120}
            aria-invalid={Boolean(err("title"))}
            required
          />
        </Field>
        <ChoiceField
          name="roleNeeded"
          label="Role needed"
          options={ROLE_CHOICES}
          defaultValue={role}
          otherPlaceholder="Type the role, like stunt double"
          error={err("roleNeeded")}
        />
        <Field
          label="Brief"
          htmlFor="description"
          error={err("description")}
          hint="12 to 4,000 characters."
        >
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={values.description}
            placeholder="The character, the look you need, call times, pay and how to apply"
            maxLength={4000}
            aria-invalid={Boolean(err("description"))}
            required
          />
        </Field>
      </Panel>

      <Panel title="The shoot">
        <PlaceFields
          defaultArea={values.area ?? encodeArea(defaultArea)}
          defaultNeighborhood={values.neighborhood}
          neighborhoodPlaceholder="Lekki, Wuse II, Trans Amadi"
          errors={{ area: err("area"), neighborhood: err("neighborhood") }}
        />
        <Field
          label="Shoot date (optional)"
          htmlFor="shootDate"
          error={err("shootDate")}
          className="sm:max-w-[calc(50%-10px)]"
        >
          <Input
            id="shootDate"
            name="shootDate"
            type="date"
            min={today}
            defaultValue={values.shootDate}
            aria-invalid={Boolean(err("shootDate"))}
          />
        </Field>
      </Panel>

      {state.error ? (
        <Notice tone="error">{state.error}</Notice>
      ) : state.fieldErrors ? (
        <Notice tone="error">
          Some details need another look. Check the fields marked in red.
        </Notice>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-[56px] px-10 text-sm font-normal"
        >
          {pending ? "Publishing…" : "Publish call"}
        </Button>
        <ButtonLink
          href="/cast/calls"
          variant="outline"
          size="lg"
          className="h-[56px] px-8 text-sm font-normal"
        >
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}

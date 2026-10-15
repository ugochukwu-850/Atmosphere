import { Plus, Sparkles } from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice, Panel } from "@/components/workspace/WorkspacePage";
import type { PlanActionState } from "@/lib/planner/actions";

/**
 * The brief, or a follow-up once a plan is on screen. Ivory-filled fields as
 * on the landing hero search card. Remount it (key) when the mode changes so
 * the fields start from the right defaults.
 */
export function BriefForm({
  action,
  pending,
  state,
  conversationId,
  defaultIdea,
  defaultArea,
}: {
  action: (formData: FormData) => void;
  pending: boolean;
  state: PlanActionState;
  /** Set when refining an existing plan. */
  conversationId?: string;
  defaultIdea?: string;
  defaultArea?: string;
}) {
  const refine = Boolean(conversationId);
  const err = (key: string) => state.fieldErrors?.[key]?.[0];

  return (
    <Panel
      title={refine ? "Refine this plan" : "Your brief"}
      description={
        refine
          ? "Add a constraint or swap something out. The planner keeps the context of this plan."
          : "Describe the idea: the mood, the places you picture, the crew and anything you must have."
      }
    >
      <form action={action} noValidate className="flex flex-col gap-5">
        {conversationId && (
          <input type="hidden" name="conversationId" value={conversationId} />
        )}
        <Field
          label={refine ? "Follow-up" : "Creative brief"}
          htmlFor="planner-idea"
          error={err("idea")}
          hint="Between 4 and 2,000 characters."
        >
          <Textarea
            id="planner-idea"
            name="idea"
            required
            maxLength={2000}
            rows={refine ? 3 : 5}
            placeholder={
              refine
                ? "Add a constraint, swap the beach for a studio…"
                : "Afrobeats video, dusk beach, then a white cyc studio…"
            }
            defaultValue={state.values?.idea ?? defaultIdea}
            aria-invalid={Boolean(err("idea"))}
            className="text-[15px] leading-relaxed"
          />
        </Field>

        <div className="grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
          <Field
            label="Preferred area (optional)"
            htmlFor="planner-area"
            error={err("area")}
          >
            <Input
              id="planner-area"
              name="area"
              maxLength={80}
              placeholder="Neighborhood or city, e.g. Yaba"
              defaultValue={state.values?.area ?? defaultArea}
              aria-invalid={Boolean(err("area"))}
              className="h-13"
            />
          </Field>
          <div className="flex flex-wrap gap-3">
            {refine && (
              <ButtonLink
                href="/planner"
                variant="outline"
                className="h-13 px-5 font-normal"
              >
                <Plus className="size-4" />
                Start a new plan
              </ButtonLink>
            )}
            <Button
              type="submit"
              disabled={pending}
              className="h-13 min-w-48 px-6 text-sm"
            >
              <Sparkles className="size-4" />
              {pending
                ? "Planning…"
                : refine
                  ? "Send follow-up"
                  : "Generate plan"}
            </Button>
          </div>
        </div>

        {state.error && <Notice tone="error">{state.error}</Notice>}
      </form>
    </Panel>
  );
}

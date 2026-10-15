"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { Notice } from "@/components/workspace/WorkspacePage";
import { createPlanAction, type PlanActionState } from "@/lib/planner/actions";
import type { Plan } from "@/lib/planner/types";

import { BriefForm } from "./BriefForm";
import { PlanEmpty, PlanSkeleton } from "./PlanStates";
import { PlanView } from "./PlanView";

/** A plan loaded on the server from `?c=<conversationId>`. */
export type SavedPlan = {
  id: string;
  plan?: Plan;
  /** Why it couldn't be shown. */
  error?: string;
  /** Its brief, to refill the form when the plan itself couldn't be read. */
  brief?: string;
};

/** A follow-up answer keeps the brief and earlier follow-ups of its plan. */
function withHistory(base: Plan | undefined, next: Plan): Plan {
  if (!base || next.brief || base.conversationId !== next.conversationId)
    return next;
  return {
    ...next,
    title: next.title ?? base.title,
    brief: base.brief,
    followUps: [...base.followUps, ...next.followUps],
  };
}

/**
 * Brief form + plan. The URL decides which plan is on screen: a new plan is
 * pushed as `?c=<id>` (reloads then load it from the API), and navigating to
 * plain /planner shows the empty brief again even though the component (and
 * its action state) is preserved by the router.
 */
export function PlannerWorkspace({
  saved,
  defaultArea,
}: {
  saved?: SavedPlan;
  defaultArea?: string;
}) {
  const c = useSearchParams().get("c") ?? undefined;

  // The plan on screen when the user sends a follow-up.
  const onScreen = useRef<Plan | undefined>(undefined);

  const [state, formAction, pending] = useActionState<
    PlanActionState,
    FormData
  >(async (prev, formData) => {
    // Don't send the previous plan back to the server; the action ignores it.
    const next = await createPlanAction({}, formData);
    // A failed follow-up keeps the current plan on screen under the error.
    if (!next.plan) return { ...next, plan: prev.plan };
    const plan = withHistory(onScreen.current, next.plan);
    const id = plan.conversationId;
    if (id && new URLSearchParams(window.location.search).get("c") !== id) {
      window.history.pushState(
        null,
        "",
        `/planner?c=${encodeURIComponent(id)}`,
      );
    }
    return { ...next, plan };
  }, {});

  // Hide the action's plan once the URL moves to another (or no) plan, and
  // show it again if the user comes back to it.
  const [urlId, setUrlId] = useState(c);
  const [hidden, setHidden] = useState<Plan>();
  if (c !== urlId) {
    setUrlId(c);
    setHidden(
      state.plan && state.plan.conversationId !== c ? state.plan : undefined,
    );
  }

  const fresh = state.plan !== hidden ? state.plan : undefined;
  const loaded = saved?.id === c ? saved : undefined;
  const active = fresh ?? loaded?.plan;

  useEffect(() => {
    onScreen.current = active;
  });

  // Bring a new answer into view once (not again when the page is revisited).
  const planRef = useRef<HTMLDivElement>(null);
  const scrolledFor = useRef<Plan | undefined>(undefined);
  useEffect(() => {
    if (!fresh || scrolledFor.current === fresh) return;
    scrolledFor.current = fresh;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    planRef.current?.scrollIntoView({
      behavior: reduce.matches ? "auto" : "smooth",
      block: "start",
    });
  }, [fresh]);

  const form = (
    <BriefForm
      key={active?.conversationId ?? "new"}
      action={formAction}
      pending={pending}
      state={state}
      conversationId={active?.conversationId}
      defaultIdea={active ? undefined : loaded?.brief}
      defaultArea={active?.area ?? defaultArea}
    />
  );

  if (active) {
    return (
      <div className="flex flex-col gap-10">
        <p role="status" className="sr-only">
          {pending ? "Updating the plan…" : ""}
        </p>
        <div ref={planRef} className="scroll-mt-6">
          <PlanView plan={active} busy={pending} />
        </div>
        {form}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {loaded?.error && <Notice tone="error">{loaded.error}</Notice>}
      {form}
      {pending ? <PlanSkeleton /> : <PlanEmpty />}
    </div>
  );
}

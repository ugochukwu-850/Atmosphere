import type { Metadata } from "next";
import { Suspense } from "react";

import { PlanSkeleton } from "@/components/planner/PlanStates";
import {
  PlannerWorkspace,
  type SavedPlan,
} from "@/components/planner/PlannerWorkspace";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { areaLabel } from "@/lib/area/area";
import { getArea } from "@/lib/area/server";
import { requireUser } from "@/lib/auth/require";
import { getPlanConversation } from "@/lib/data/planner";
import { apiErrorMessage } from "@/lib/forms";
import { isEmptyPlan } from "@/lib/planner/types";
import { param } from "@/lib/search-params";

export const metadata: Metadata = { title: "Planner" };

export default function PlannerPage({ searchParams }: PageProps<"/planner">) {
  return (
    <WorkspacePage
      crumbs={[{ href: "/", label: "Home" }, { label: "Production Planner" }]}
      eyebrow="Planner"
      title="Plan a shoot"
      description="Describe your idea and get the kit, shot types, talent and budget your production needs, matched to what you can book."
    >
      {/* Session, area cookie and ?c= are request-time data. */}
      <Suspense fallback={<PlanSkeleton label="Loading the planner…" />}>
        <Planner searchParams={searchParams} />
      </Suspense>
    </WorkspacePage>
  );
}

async function Planner({
  searchParams,
}: Pick<PageProps<"/planner">, "searchParams">) {
  const id = param(await searchParams, "c");
  const { token } = await requireUser(
    id ? `/planner?c=${encodeURIComponent(id)}` : "/planner",
  );
  const [area, saved] = await Promise.all([
    getArea(),
    id ? loadSaved(token, id) : undefined,
  ]);

  return (
    <PlannerWorkspace
      saved={saved}
      // Prefill the production area picked in the header, if any.
      defaultArea={area.state || area.city ? areaLabel(area) : undefined}
    />
  );
}

/** The plan behind `?c=`, or a message saying why it can't be shown. */
async function loadSaved(token: string, id: string): Promise<SavedPlan> {
  try {
    const plan = await getPlanConversation(token, id);
    if (!plan) {
      return {
        id,
        error: "We couldn't find that plan. Start a new one below.",
      };
    }
    if (isEmptyPlan(plan)) {
      return {
        id,
        brief: plan.brief,
        error:
          "That plan was saved, but its details couldn't be read. Run the brief again below.",
      };
    }
    return { id, plan };
  } catch (err) {
    return {
      id,
      error: apiErrorMessage(err, {
        403: "That plan belongs to another account. Start a new one below.",
      }),
    };
  }
}

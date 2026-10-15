/** Copy for the gear handoff checklist, shared by the form and the history. */
import type { BookingHandoff, HandoffPhase } from "@/lib/data/bookings";

export const HANDOFF_PHASES: {
  value: HandoffPhase;
  label: string;
  hint: string;
}[] = [
  { value: "out", label: "Pickup", hint: "The kit is leaving the owner." },
  { value: "in", label: "Return", hint: "The kit is coming back." },
];

export const phaseLabel = (phase: HandoffPhase) =>
  phase === "in" ? "Return" : "Pickup";

type Check = keyof Pick<
  BookingHandoff,
  | "serialChecked"
  | "accessoriesComplete"
  | "existingDamageNoted"
  | "functionTest"
>;

export const HANDOFF_CHECKS: { name: Check; label: string; hint: string }[] = [
  {
    name: "serialChecked",
    label: "Serial number checked",
    hint: "Matches the serial on the listing.",
  },
  {
    name: "accessoriesComplete",
    label: "Accessories complete",
    hint: "Batteries, cables, cases and everything in the kit list.",
  },
  {
    name: "existingDamageNoted",
    label: "Existing damage noted",
    hint: "Scratches or wear are written in the notes or photographed.",
  },
  {
    name: "functionTest",
    label: "Function test passed",
    hint: "Powered on and tested together.",
  },
];

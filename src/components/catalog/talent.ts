import { titleCase } from "@/lib/format";

/** Talent titles come as "Amaka Eze — actor / model". */
export function splitTalentTitle(title: string): {
  name: string;
  headline?: string;
} {
  const [name, ...rest] = title.split(" — ");
  return { name: name ?? title, headline: rest.join(" — ") || undefined };
}

export function roleLabel(role: string): string {
  return role.toLowerCase() === "dp" ? "DP" : titleCase(role);
}

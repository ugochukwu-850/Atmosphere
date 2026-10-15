import {
  CardGrid,
  CardLinks,
  CatalogCard,
} from "@/components/catalog/CatalogCard";
import { PinCard } from "@/components/catalog/PinCard";
import { roleLabel, splitTalentTitle } from "@/components/catalog/talent";
import type { BadgeVariant } from "@/components/ui/badge";
import { titleCase } from "@/lib/format";
import type { PlanSuggestion, SuggestionKind } from "@/lib/planner/types";

const GROUPS: { title: string; kinds: SuggestionKind[] }[] = [
  { title: "Locations", kinds: ["location", "pin"] },
  { title: "Kit to rent or buy", kinds: ["gear", "gear_sale"] },
  { title: "Creatives", kinds: ["talent"] },
  { title: "Also in the catalog", kinds: ["other"] },
];

/** Catalog rows the planner matched, grouped like the catalog's own pages. */
export function PlanSuggestions({
  suggestions,
}: {
  suggestions: PlanSuggestion[];
}) {
  return (
    <div className="flex flex-col gap-10">
      {GROUPS.map(({ title, kinds }) => {
        const rows = suggestions.filter((s) => kinds.includes(s.kind));
        if (rows.length === 0) return null;
        return (
          <section key={title} className="flex flex-col gap-4">
            <h3 className="font-sans text-lg font-bold">
              {title}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {rows.length}
              </span>
            </h3>
            <CardGrid>
              {rows.map((s) => (
                <SuggestionCard key={`${s.kind}-${s.id}`} item={s} />
              ))}
            </CardGrid>
          </section>
        );
      })}
    </div>
  );
}

/** Line total for the plan when the API priced it, else the listed rate. */
function price(item: PlanSuggestion) {
  if (item.lineTotalNgn)
    return { amountNgn: item.lineTotalNgn, unit: "for this plan" };
  if (item.kind === "gear_sale" && item.salePriceNgn)
    return { amountNgn: item.salePriceNgn, unit: "asking" };
  if (item.dayRateNgn) return { amountNgn: item.dayRateNgn, unit: "/ day" };
  return undefined;
}

const kicker = (...parts: (string | undefined)[]) =>
  parts.filter(Boolean).join(" / ");

function SuggestionCard({ item }: { item: PlanSuggestion }) {
  // Scout pins have no detail page; PinCard opens their notes in a dialog.
  if (item.kind === "pin") {
    if (item.lat !== undefined && item.lng !== undefined) {
      return <PinCard pin={{ ...item, lat: item.lat, lng: item.lng }} />;
    }
    return (
      <CatalogCard
        id={item.id}
        photoUrl={item.photoUrl}
        badge={{ label: "Scout-only", variant: "scout" }}
        kicker={kicker(item.category, item.neighborhood)}
        title={item.title}
        description={item.description}
        actions={null}
      />
    );
  }

  if (item.kind === "talent") {
    const { name, headline } = splitTalentTitle(item.title);
    const href = `/cast/talent/${item.id}`;
    return (
      <CatalogCard
        id={item.id}
        href={href}
        photoUrl={item.photoUrl}
        badge={{ label: roleLabel(item.category), variant: "bookable" }}
        kicker={kicker(headline ?? item.category, item.neighborhood)}
        title={name}
        description={item.description}
        price={price(item)}
        actions={
          <CardLinks
            href={href}
            secondary={{ label: "Request to hire", href: `${href}?request=1` }}
          />
        }
      />
    );
  }

  const { badge, variant, secondary } = LISTING[item.kind];
  // Unknown kinds may not be listings, so they get no detail link.
  const href = item.kind === "other" ? undefined : `/listings/${item.id}`;

  return (
    <CatalogCard
      id={item.id}
      href={href}
      photoUrl={item.photoUrl}
      badge={{ label: badge, variant }}
      kicker={kicker(
        item.category && titleCase(item.category),
        item.neighborhood,
      )}
      title={item.title}
      description={item.description}
      price={price(item)}
      actions={
        href ? <CardLinks href={href} secondary={secondary?.(href)} /> : null
      }
    />
  );
}

/** Badge and secondary action per listing kind (as on the catalog pages). */
const LISTING: Record<
  Exclude<SuggestionKind, "pin" | "talent">,
  {
    badge: string;
    variant: BadgeVariant;
    secondary?: (href: string) => { label: string; href: string };
  }
> = {
  location: {
    badge: "Bookable",
    variant: "bookable",
    secondary: (href) => ({
      label: "Request a booking",
      href: `${href}?request=1`,
    }),
  },
  gear: {
    badge: "For rent",
    variant: "bookable",
    secondary: (href) => ({
      label: "Request rental",
      href: `${href}?request=1`,
    }),
  },
  gear_sale: {
    badge: "For sale",
    variant: "bookable",
    secondary: (href) => ({ label: "Contact seller", href }),
  },
  other: { badge: "In catalog", variant: "neutral" },
};

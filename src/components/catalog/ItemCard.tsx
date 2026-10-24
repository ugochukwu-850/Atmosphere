import type { BadgeVariant } from "@/components/ui/badge";
import type { CatalogItem, ItemKind } from "@/lib/data/types";
import { titleCase } from "@/lib/format";

import { CardLinks, CatalogCard } from "./CatalogCard";
import { roleLabel, splitTalentTitle } from "./talent";

/** Badge, link and secondary action per kind, as on the catalog pages. */
const KIND: Record<
  ItemKind,
  {
    badge: (item: CatalogItem) => string;
    variant: BadgeVariant;
    href: (id: string) => string;
    secondary: (href: string) => { label: string; href: string };
  }
> = {
  location: {
    badge: () => "Bookable",
    variant: "bookable",
    href: (id) => `/listings/${id}`,
    secondary: (href) => ({
      label: "Request a booking",
      href: `${href}?request=1`,
    }),
  },
  gear: {
    badge: () => "For rent",
    variant: "bookable",
    href: (id) => `/listings/${id}`,
    secondary: (href) => ({
      label: "Request rental",
      href: `${href}?request=1`,
    }),
  },
  gear_sale: {
    badge: () => "For sale",
    variant: "bookable",
    href: (id) => `/listings/${id}`,
    secondary: (href) => ({ label: "Contact seller", href }),
  },
  talent: {
    badge: (item) => roleLabel(item.category),
    variant: "bookable",
    href: (id) => `/cast/talent/${id}`,
    secondary: (href) => ({
      label: "Request to hire",
      href: `${href}?request=1`,
    }),
  },
};

function price(item: CatalogItem) {
  if (item.kind === "gear_sale" && item.salePriceNgn)
    return { amountNgn: item.salePriceNgn, unit: "asking" };
  if (item.dayRateNgn) return { amountNgn: item.dayRateNgn, unit: "/ day" };
  return undefined;
}

/** Catalog card for any listing kind (saved items mix locations, kit and talent). */
export function ItemCard({
  item,
  refreshOnSave,
}: {
  item: CatalogItem;
  refreshOnSave?: boolean;
}) {
  const kind = KIND[item.kind];
  const href = kind.href(item.id);
  const talent = item.kind === "talent" ? splitTalentTitle(item.title) : null;
  const category = talent
    ? (talent.headline ?? item.category)
    : item.category && titleCase(item.category);

  return (
    <CatalogCard
      id={item.id}
      href={href}
      photoUrl={item.photoUrl}
      badge={{ label: kind.badge(item), variant: kind.variant }}
      kicker={[category, item.neighborhood].filter(Boolean).join(" / ")}
      title={talent ? talent.name : item.title}
      description={item.description}
      price={price(item)}
      refreshOnSave={refreshOnSave}
      actions={<CardLinks href={href} secondary={kind.secondary(href)} />}
    />
  );
}

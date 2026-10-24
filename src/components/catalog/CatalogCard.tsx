import Link from "next/link";
import type { ReactNode } from "react";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { formatNgn } from "@/lib/format";

import { BookmarkButton } from "./BookmarkButton";

/** Small card buttons from the frame (36px, 4px radius). */
export const cardButton = (variant: "primary" | "secondary") =>
  buttonClasses({
    variant,
    size: "sm",
    className: "h-9 rounded-xs px-3.5 text-xs font-normal",
  });

/** "View details" + secondary link pair used by most cards. */
export function CardLinks({
  href,
  secondary,
}: {
  href: string;
  secondary?: { label: string; href: string };
}) {
  return (
    <>
      <Link href={href} className={cardButton("primary")}>
        View details
      </Link>
      {secondary && (
        <Link href={secondary.href} className={cardButton("secondary")}>
          {secondary.label}
        </Link>
      )}
    </>
  );
}

/**
 * Listing card from the Location Search frame: photo with status badge and
 * bookmark, rust caps kicker, title, two-line description, price, then a rust
 * "View details" and an olive secondary action.
 */
export function CatalogCard({
  id,
  href,
  photoUrl,
  badge,
  kicker,
  title,
  description,
  price,
  actions,
  refreshOnSave,
}: {
  id: string;
  /** Detail page; omitted for scout pins, which have no page. */
  href?: string;
  photoUrl?: string;
  badge: { label: string; variant: BadgeVariant };
  kicker: string;
  title: string;
  description: string;
  price?: { amountNgn: number; unit: string };
  actions: ReactNode;
  /** Re-render the page when the bookmark changes (saved-item lists). */
  refreshOnSave?: boolean;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-sand/40 bg-card p-5 dark:border-border">
      <div className="relative aspect-[417/300] overflow-hidden rounded-lg bg-muted">
        {href ? (
          <Link
            href={href}
            tabIndex={-1}
            aria-hidden
            className="absolute inset-0"
          >
            <CardPhoto src={photoUrl} />
          </Link>
        ) : (
          <CardPhoto src={photoUrl} />
        )}
        <Badge variant={badge.variant} className="absolute top-3 left-3">
          {badge.label}
        </Badge>
        <BookmarkButton
          id={id}
          title={title}
          refresh={refreshOnSave}
          className="absolute top-3 right-3"
        />
      </div>

      <p className="mt-5 text-[10px] leading-none font-extrabold tracking-[0.04em] text-primary uppercase">
        {kicker}
      </p>
      <h3 className="mt-2 font-heading text-[22px] leading-tight">
        {href ? (
          <Link href={href} className="hover:text-primary">
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
        {description}
      </p>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-7">
        {price ? (
          <p className="text-xl font-semibold">
            {formatNgn(price.amountNgn)}
            <span className="ml-1 text-[11px] font-normal text-muted-foreground">
              {price.unit}
            </span>
          </p>
        ) : (
          <span />
        )}
        <div className="flex gap-2">{actions}</div>
      </div>
    </article>
  );
}

function CardPhoto({ src }: { src?: string }) {
  return (
    <SafeImage
      src={src}
      alt=""
      fill
      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover transition-transform duration-500 hover:scale-105"
    />
  );
}

/** Grid wrapper: 3 columns, 16px gaps (Figma). */
export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

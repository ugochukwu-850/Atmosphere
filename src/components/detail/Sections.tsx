import type { ReactNode } from "react";

import { DotList } from "@/components/ui/typography";

/** "Production details", "Access and production notes", … */
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="font-sans text-[22px] font-bold">{children}</h3>;
}

/** Avatar + "Listed by …" row. */
export function ListedBy({
  label,
  name,
  href,
}: {
  label: string;
  name: string;
  href?: string;
}) {
  const content = (
    <>
      <span
        aria-hidden
        className="grid size-[50px] shrink-0 place-items-center rounded-full bg-[#d9d9d9] text-sm font-semibold text-charcoal"
      >
        {name
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()}
      </span>
      <span className="flex flex-col text-[13px] leading-snug">
        <span>{label}</span>
        <span className="font-semibold">{name}</span>
      </span>
    </>
  );
  return href ? (
    <a href={href} className="flex items-center gap-3 hover:text-primary">
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-3">{content}</div>
  );
}

/** Dot facts between two rules ("● Studio  ● Rate ₦180,000 / day  ● Bookable"). */
export function FactsRow({ items }: { items: string[] }) {
  return (
    <div className="border-y py-5">
      <DotList items={items} className="pl-6" />
    </div>
  );
}

/** Two-column list with rust bullets. */
export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-3 text-lg text-muted-foreground"
        >
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-primary"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Ivory note with a rust left border ("Before you request"). */
export function Callout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-l-[3px] border-primary bg-muted px-5 py-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1.5 text-xs text-muted-foreground">{children}</p>
    </div>
  );
}

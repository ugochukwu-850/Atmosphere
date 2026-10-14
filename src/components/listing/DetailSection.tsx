import type { ReactNode } from "react";

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t pt-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-muted px-3 py-1 text-sm">
          {item}
        </li>
      ))}
    </ul>
  );
}

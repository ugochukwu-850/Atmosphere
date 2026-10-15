import { WIDE } from "@/components/catalog/SearchBand";
import { DotList } from "@/components/ui/typography";

import { Breadcrumb, type Crumb } from "./Breadcrumb";

/** Breadcrumb, big title and dot facts (Figma: Location Detail). */
export function DetailHeader({
  crumbs,
  title,
  facts,
}: {
  crumbs: Crumb[];
  title: string;
  facts: string[];
}) {
  return (
    <div className={`${WIDE} flex flex-col pt-10 md:pt-20`}>
      <div className="flex flex-col md:pl-[22px]">
        <Breadcrumb crumbs={crumbs} />
        <h1 className="mt-8 max-w-[44rem] text-5xl leading-[0.95] font-bold tracking-tight md:text-[64px]">
          {title}
        </h1>
        <DotList items={facts} className="mt-10 md:pl-6" />
      </div>
    </div>
  );
}

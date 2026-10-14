import { ChevronLeft } from "lucide-react";

import { WIDE } from "@/components/catalog/SearchBand";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";

import { DetailHeader } from "./DetailHeader";
import { Callout } from "./Sections";

/** Styled placeholder for pages that aren't built yet, on the detail template. */
export function ComingSoon({
  crumb,
  title,
  description,
  back = { href: "/", label: "Back to home" },
}: {
  crumb: string;
  title: string;
  description: string;
  back?: { href: string; label: string };
}) {
  return (
    <article className="pb-24">
      <DetailHeader
        crumbs={[{ href: "/", label: "Home" }, { label: crumb }]}
        title={title}
        facts={["Coming soon"]}
      />
      <div
        className={`${WIDE} mt-14 flex max-w-[60rem] flex-col gap-8 md:pl-[74px]`}
      >
        <Eyebrow>In progress</Eyebrow>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
        <Callout title="Being rebuilt">
          This page is part of the new ArtMostSphere frontend and lands soon.
        </Callout>
        <ButtonLink
          href={back.href}
          variant="outline"
          className="h-12 self-start px-5 text-sm font-normal"
        >
          <ChevronLeft className="size-4" />
          {back.label}
        </ButtonLink>
      </div>
    </article>
  );
}

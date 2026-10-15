import { ArrowUpRight } from "lucide-react";

import { buttonClasses } from "@/components/ui/button";
import type { Person } from "@/lib/data/types";
import { titleCase } from "@/lib/format";
import { isSocialPlatform, PLATFORM_LABEL } from "@/lib/validators/account";

export function platformLabel(platform: string): string {
  return isSocialPlatform(platform)
    ? PLATFORM_LABEL[platform]
    : titleCase(platform);
}

/** Linked social accounts as outline chips ("Instagram @ada ↗"). */
export function SocialLinks({ socials }: { socials: Person["socials"] }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {socials.map((social) => {
        const handle = social.handle.startsWith("@")
          ? social.handle
          : `@${social.handle}`;
        const content = (
          <>
            <span className="font-semibold">
              {platformLabel(social.platform)}
            </span>
            <span className="text-muted-foreground">{handle}</span>
          </>
        );
        const chip = buttonClasses({
          variant: "outline",
          size: "lg",
          className: "font-normal",
        });
        // The API builds the profile URL; only follow it when it is https.
        const url = social.url?.startsWith("https://") ? social.url : null;
        return (
          <li key={social.platform}>
            {url ? (
              <a href={url} target="_blank" rel="noreferrer" className={chip}>
                {content}
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            ) : (
              <span className={`${chip} hover:bg-transparent`}>{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

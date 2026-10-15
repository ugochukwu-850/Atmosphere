import type { Metadata } from "next";
import Link from "next/link";

import { Callout } from "@/components/detail/Sections";
import { IssueForm } from "@/components/issues/IssueForm";
import { Panel, WorkspacePage } from "@/components/workspace/WorkspacePage";

export const metadata: Metadata = { title: "Contact" };

const QUICK_LINKS = [
  { href: "/#faq", label: "Frequently asked questions" },
  { href: "/#how", label: "How ArtMostSphere works" },
  { href: "/terms", label: "Terms and Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
] as const;

export default function ContactPage() {
  return (
    <WorkspacePage
      crumbs={[{ href: "/", label: "Home" }, { label: "Contact Us" }]}
      eyebrow="Contact"
      title="Contact us"
      description="Questions, partnerships or something not working? We'd love to hear from you."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,876fr)_minmax(0,475fr)] lg:gap-[55px]">
        <Panel
          title="Report an issue"
          description="Tell us what broke or what's missing. Reports go straight to the team; no account needed."
        >
          <IssueForm />
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Quick answers">
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
          <Callout title="A question about a booking?">
            Message the provider from the booking thread. They can confirm
            dates, handoffs and any terms directly.
          </Callout>
        </div>
      </div>
    </WorkspacePage>
  );
}

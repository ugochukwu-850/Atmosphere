import type { Metadata } from "next";

import { EmptyState } from "@/components/catalog/EmptyState";
import {
  DASHBOARD_PAGE,
  DashboardHeading,
} from "@/components/dashboard/DashboardPage";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Notifications" };

/**
 * Figma: Dashboard / Notification. The API has no notifications endpoint yet,
 * so the list (All / Unread / Read, mark read) waits on the backend; booking
 * activity meanwhile lives on the bookings page.
 */
export default function NotificationsPage() {
  return (
    <div className={DASHBOARD_PAGE}>
      <DashboardHeading
        title="Notifications"
        description="Manage your notifications and stay updated"
      />
      <div className="mt-8">
        <EmptyState
          title="No notifications yet"
          description="Booking approvals and payment updates will show up here. Until then, follow your requests from the bookings page."
          action={
            <ButtonLink href="/bookings" variant="outline">
              Go to bookings
            </ButtonLink>
          }
        />
      </div>
    </div>
  );
}

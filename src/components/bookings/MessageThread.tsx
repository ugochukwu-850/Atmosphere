import type { BookingMessage } from "@/lib/data/bookings";
import { cn } from "@/lib/utils";

import { formatDateTime } from "./status";

/**
 * Booking messages, oldest first. The viewer's own messages sit on the right
 * in a rust tint; the other party's on the left in warm ivory.
 */
export function MessageThread({
  messages,
  viewerId,
}: {
  messages: BookingMessage[];
  viewerId: string;
}) {
  if (messages.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-5 py-8 text-center text-sm text-muted-foreground">
        No messages yet. Say hello, confirm call times and agree how payment
        works.
      </p>
    );
  }

  return (
    <ol aria-label="Messages" className="flex flex-col gap-5">
      {messages.map((message) => {
        const mine = Boolean(message.authorId) && message.authorId === viewerId;
        const time = formatDateTime(message.createdAt);
        return (
          <li
            key={message.id}
            className={cn(
              "flex max-w-[85%] flex-col gap-1.5",
              mine ? "items-end self-end" : "items-start",
            )}
          >
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {mine ? "You" : (message.authorName ?? "Participant")}
              </span>
              {time && (
                <>
                  {" · "}
                  <time dateTime={message.createdAt}>{time}</time>
                </>
              )}
            </p>
            <p
              className={cn(
                "rounded-lg px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap",
                mine ? "bg-primary/10" : "bg-muted",
              )}
            >
              {message.body}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

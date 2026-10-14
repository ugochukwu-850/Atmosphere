"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Eyebrow } from "./typography";

/**
 * Modal from "Location Detail 2": warm ivory panel, rust eyebrow, close X.
 * Built on <dialog> for focus trapping and Esc handling.
 */
export function Dialog({
  open,
  onClose,
  eyebrow,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Clicking the backdrop closes the dialog.
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className={cn(
        "m-auto w-[min(46rem,calc(100%-2rem))] rounded-xs bg-ivory p-0 text-charcoal shadow-2xl backdrop:bg-black/60 dark:bg-card dark:text-foreground",
        className,
      )}
    >
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2 className="font-sans text-2xl font-bold md:text-4xl">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xs p-1 text-charcoal-600 hover:text-charcoal dark:text-muted-foreground"
          >
            <X className="size-7" strokeWidth={1.5} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

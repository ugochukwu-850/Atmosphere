"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { SafeImage } from "@/components/ui/safe-image";
import type { ScoutPin } from "@/lib/data/types";
import { titleCase } from "@/lib/format";

import { CatalogCard, cardButton } from "./CatalogCard";

/**
 * Scout-only place: no detail page or booking, so both card buttons open a
 * dialog with the photo, notes and access/permit information.
 */
export function PinCard({ pin }: { pin: ScoutPin }) {
  const [open, setOpen] = useState(false);
  const directions = `https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lng}`;

  return (
    <>
      <CatalogCard
        id={pin.id}
        photoUrl={pin.photoUrl}
        badge={{ label: "Scout-only", variant: "scout" }}
        kicker={[pin.category, pin.neighborhood].filter(Boolean).join(" / ")}
        title={pin.title}
        description={pin.description}
        actions={
          <>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cardButton("primary")}
            >
              View details
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cardButton("secondary")}
            >
              Contact Venue
            </button>
          </>
        }
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Scout-only place"
        title={pin.title}
      >
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <SafeImage
            src={pin.photoUrl}
            alt={pin.title}
            fill
            sizes="46rem"
            className="object-cover"
          />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          {[pin.neighborhood, pin.city].filter(Boolean).join(", ")} ·{" "}
          {titleCase(pin.category)}
        </p>
        <p className="text-base">{pin.description}</p>
        {pin.accessNotes && (
          <div className="border-l-4 border-primary bg-white/60 px-4 py-3 dark:bg-muted">
            <p className="text-sm font-semibold">Access and permits</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {pin.accessNotes}
            </p>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Public places aren&apos;t booked through ArtMostSphere. Arrange access
          with the venue or the relevant authority before you shoot.
        </p>
        <a
          href={directions}
          target="_blank"
          rel="noreferrer"
          className={`${cardButton("primary")} h-12 self-start px-6 text-sm`}
        >
          Get directions
        </a>
      </Dialog>
    </>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { encodeArea } from "@/components/search/AreaSelect";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice, Panel } from "@/components/workspace/WorkspacePage";
import type { Area } from "@/lib/area/area";
import {
  createListingAction,
  type ListingFormState,
} from "@/lib/listings/actions";
import { OTHER_CHOICE } from "@/lib/validators/fields";
import { CATEGORY_CHOICES, type ListingKind } from "@/lib/validators/listing";
import type { LatLng } from "@/types/map";

import { ChoiceField } from "./ChoiceField";
import { KIND_COPY } from "./copy";
import { KindPicker } from "./KindPicker";
import { PlaceFields } from "./PlaceFields";
import { keepValuesOnSubmit } from "./submit";

const SUBMIT =
  "h-[56px] self-start px-10 text-sm font-normal sm:self-auto" as const;

/**
 * "List something": the kinds the user's roles allow, details, place and an
 * optional map pin. After a successful submit, "List something else" starts a
 * fresh form.
 */
export function ListingForm({
  kinds,
  defaultArea,
}: {
  kinds: ListingKind[];
  /** The visitor's production area, to preselect the city. */
  defaultArea: Area;
}) {
  const [round, setRound] = useState(0);
  return (
    <ListingFormRound
      key={round}
      kinds={kinds}
      defaultArea={defaultArea}
      onAnother={() => setRound((r) => r + 1)}
    />
  );
}

function ListingFormRound({
  kinds,
  defaultArea,
  onAnother,
}: {
  kinds: ListingKind[];
  defaultArea: Area;
  onAnother: () => void;
}) {
  const [state, action, pending] = useActionState<ListingFormState, FormData>(
    createListingAction,
    {},
  );
  const values = state.values ?? {};
  const [kind, setKind] = useState<ListingKind>(
    () => kinds.find((k) => k === values.kind) ?? kinds[0],
  );
  const err = (key: string) => state.fieldErrors?.[key]?.[0];
  const copy = KIND_COPY[kind];
  const gear = kind === "gear" || kind === "gear_sale";

  if (state.ok) {
    return <Submitted kind={kind} id={state.id} onAnother={onAnother} />;
  }

  // Refill after a submit without JS (with JS, nothing is reset).
  const category =
    values.kind !== kind
      ? ""
      : values.categoryChoice === OTHER_CHOICE
        ? values.categoryOther
        : values.categoryChoice;
  const defaultPin: LatLng | null =
    values.lat && values.lng
      ? { lat: Number(values.lat), lng: Number(values.lng) }
      : null;

  return (
    <form
      action={action}
      onSubmit={keepValuesOnSubmit(action)}
      noValidate
      className="flex flex-col gap-8"
    >
      {kinds.length > 1 ? (
        <Panel title="What are you listing?">
          <KindPicker
            kinds={kinds}
            value={kind}
            onChange={setKind}
            error={err("kind")}
          />
        </Panel>
      ) : (
        <input type="hidden" name="kind" value={kind} />
      )}

      <Panel title={copy.detailsTitle}>
        <Field label={copy.titleLabel} htmlFor="title" error={err("title")}>
          <Input
            id="title"
            name="title"
            defaultValue={values.title}
            placeholder={copy.titlePlaceholder}
            maxLength={120}
            aria-invalid={Boolean(err("title"))}
            required
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <ChoiceField
            key={kind}
            name="category"
            label={copy.categoryLabel}
            options={CATEGORY_CHOICES[kind]}
            defaultValue={category}
            placeholder="Choose one"
            otherPlaceholder="Type a category"
            error={err("category")}
          />
          <Field
            label={copy.priceLabel}
            htmlFor="price"
            error={err("price")}
            hint="Whole naira, no kobo."
          >
            <Input
              id="price"
              name="price"
              inputMode="numeric"
              autoComplete="off"
              defaultValue={values.price}
              placeholder={copy.pricePlaceholder}
              aria-invalid={Boolean(err("price"))}
              required
            />
          </Field>
        </div>
        <Field
          label={copy.descriptionLabel}
          htmlFor="description"
          error={err("description")}
          hint="12 to 4,000 characters."
        >
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={values.description}
            placeholder={copy.descriptionPlaceholder}
            maxLength={4000}
            aria-invalid={Boolean(err("description"))}
            required
          />
        </Field>
        {gear && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Serial number (optional)"
              htmlFor="serialNumber"
              error={err("serialNumber")}
              hint={
                kind === "gear"
                  ? "Renters check it at pickup and return."
                  : "Buyers can check it before they pay."
              }
            >
              <Input
                id="serialNumber"
                name="serialNumber"
                defaultValue={values.serialNumber}
                maxLength={80}
                autoComplete="off"
                aria-invalid={Boolean(err("serialNumber"))}
              />
            </Field>
            <Field
              label="What's included (optional)"
              htmlFor="accessories"
              error={err("accessories")}
              hint="Separate items with commas."
            >
              <Input
                id="accessories"
                name="accessories"
                defaultValue={values.accessories}
                placeholder="Batteries, charger, 2 × 128GB cards, case"
                maxLength={400}
                aria-invalid={Boolean(err("accessories"))}
              />
            </Field>
          </div>
        )}
      </Panel>

      <Panel
        title={copy.whereTitle}
        description="The city and neighbourhood show on the listing. The pin places it on the map."
      >
        <PlaceFields
          defaultArea={values.area ?? encodeArea(defaultArea)}
          defaultNeighborhood={values.neighborhood}
          neighborhoodPlaceholder={copy.neighborhoodPlaceholder}
          errors={{
            area: err("area"),
            neighborhood: err("neighborhood"),
            pin: err("lat") ?? err("lng"),
          }}
          pin={{ what: copy.pinWhat, defaultPin }}
        />
      </Panel>

      {state.error ? (
        <Notice tone="error">{state.error}</Notice>
      ) : state.fieldErrors ? (
        <Notice tone="error">
          Some details need another look. Check the fields marked in red.
        </Notice>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <Button type="submit" size="lg" disabled={pending} className={SUBMIT}>
          {pending ? "Submitting…" : "Submit for review"}
        </Button>
        <p className="text-xs text-muted-foreground">
          An admin reviews every new listing before it goes live.
        </p>
      </div>
    </form>
  );
}

function Submitted({
  kind,
  id,
  onAnother,
}: {
  kind: ListingKind;
  id?: string;
  onAnother: () => void;
}) {
  const copy = KIND_COPY[kind];
  return (
    <Panel title="Sent for review">
      <Notice tone="success">
        Thanks. Your {copy.noun} is in the review queue.
      </Notice>
      <p className="text-lg leading-relaxed text-muted-foreground">
        An admin checks every new listing before it goes live. Once it&apos;s
        approved, it shows up {copy.live}
        {id ? (
          <>
            {" "}
            and on{" "}
            <Link
              href={copy.href(id)}
              className="font-semibold text-primary hover:underline"
            >
              its own page
            </Link>
          </>
        ) : null}
        .
      </p>
      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={onAnother} className={SUBMIT}>
          List something else
        </Button>
        <ButtonLink
          href="/"
          variant="outline"
          size="lg"
          className="h-[56px] px-8 text-sm font-normal"
        >
          Back to home
        </ButtonLink>
      </div>
    </Panel>
  );
}

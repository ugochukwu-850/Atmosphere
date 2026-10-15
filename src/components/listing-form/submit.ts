import { startTransition, type FormEvent } from "react";

/**
 * onSubmit for forms driven by useActionState. React resets a form after its
 * action runs, and a <select> snaps back to the option it first rendered
 * (React never updates defaultSelected), so a failed submit would quietly
 * change the city, category or role on screen. Dispatching the action in a
 * transition ourselves skips that reset and keeps everything as typed.
 * Without JS the form still posts through `action`, and the action's
 * `values` refill it.
 */
export function keepValuesOnSubmit(dispatch: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  };
}

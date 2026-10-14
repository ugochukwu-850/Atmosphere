import { Suspense } from "react";

// `params` is request-time data under cacheComponents, so it is read inside Suspense.
export default function BookingPage({ params }: PageProps<"/bookings/[id]">) {
  return (
    <Suspense>
      <BookingContent params={params} />
    </Suspense>
  );
}

async function BookingContent({ params }: Pick<PageProps<"/bookings/[id]">, "params">) {
  const { id } = await params;
  return <h1>Booking {id}</h1>;
}

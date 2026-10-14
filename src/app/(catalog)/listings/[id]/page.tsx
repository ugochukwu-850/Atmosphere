import { Suspense } from "react";

// `params` is request-time data under cacheComponents, so it is read inside Suspense.
export default function ListingPage({ params }: PageProps<"/listings/[id]">) {
  return (
    <Suspense>
      <ListingContent params={params} />
    </Suspense>
  );
}

async function ListingContent({ params }: Pick<PageProps<"/listings/[id]">, "params">) {
  const { id } = await params;
  return <h1>Listing {id}</h1>;
}

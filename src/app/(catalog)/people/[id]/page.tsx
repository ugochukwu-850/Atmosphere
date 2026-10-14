import { Suspense } from "react";

// `params` is request-time data under cacheComponents, so it is read inside Suspense.
export default function PersonPage({ params }: PageProps<"/people/[id]">) {
  return (
    <Suspense>
      <PersonContent params={params} />
    </Suspense>
  );
}

async function PersonContent({
  params,
}: Pick<PageProps<"/people/[id]">, "params">) {
  const { id } = await params;
  return <h1>Profile {id}</h1>;
}

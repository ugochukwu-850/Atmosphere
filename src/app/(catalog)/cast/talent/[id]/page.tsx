import { Suspense } from "react";

// `params` is request-time data under cacheComponents, so it is read inside Suspense.
export default function TalentPage({ params }: PageProps<"/cast/talent/[id]">) {
  return (
    <Suspense>
      <TalentContent params={params} />
    </Suspense>
  );
}

async function TalentContent({ params }: Pick<PageProps<"/cast/talent/[id]">, "params">) {
  const { id } = await params;
  return <h1>Talent {id}</h1>;
}

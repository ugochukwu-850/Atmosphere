import { cookies } from "next/headers";

import { AREA_COOKIE, parseArea, type Area } from "./area";

/** Read the production area on the server. Dynamic: wrap callers in <Suspense>. */
export async function getArea(): Promise<Area> {
  const store = await cookies();
  return parseArea(store.get(AREA_COOKIE)?.value);
}

import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Optimistic auth guard: bounce signed-out visitors away from app routes.
 * Only checks the cookie exists; pages still verify the session with the API.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/saved/:path*",
    "/notifications/:path*",
    "/planner/:path*",
    "/list/:path*",
    "/bookings/:path*",
    "/account/:path*",
    "/cast/calls/new",
  ],
};

import "server-only";
import { cache } from "react";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";

/** Share one validated session lookup across the current server render. */
export const getCurrentSession = cache(async () => {
  const requestHeaders = await headers();
  const request = new Request("http://localhost", { headers: requestHeaders });

  // Anonymous requests can render the public navbar without contacting the auth database.
  if (!getSessionCookie(request)) return null;

  const { auth } = await import("@/lib/auth");
  return auth.api.getSession({ headers: requestHeaders });
});

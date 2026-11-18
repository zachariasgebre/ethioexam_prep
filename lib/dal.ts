import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/current-session";

export const verifySession = cache(async () => {
  const session = await getCurrentSession();
  if (!session) redirect("/sign-in");
  return session;
});

export const verifyPaidSession = cache(async () => {
  const session = await verifySession();
  if (session.user.role !== "admin" && session.user.hasPaid !== true) {
    redirect("/pricing");
  }
  return session;
});

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { user } from "@/db/schema";
import { verifySession } from "@/lib/dal";

/**
 * Toggles or updates the hasPaid subscription status of a target user.
 * Protected by verifySession() (Attack 1 prevention) and admin role check.
 */
export async function toggleUserPaidStatus(targetUserId: string, hasPaid: boolean) {
  // ATTACK 1 PREVENTION: Strict session check; unauthenticated calls are rejected immediately
  const { user: currentUser } = await verifySession();

  // ROLE GUARD: Only users with the 'admin' role are authorized to modify user subscription access
  if (currentUser.role !== "admin") {
    return { error: "Unauthorized: Admin role required" };
  }

  if (typeof targetUserId !== "string" || !targetUserId.trim() || typeof hasPaid !== "boolean") {
    return { error: "Invalid parameters" };
  }

  const updated = await db
    .update(user)
    .set({ hasPaid, updatedAt: new Date() })
    .where(eq(user.id, targetUserId))
    .returning({ id: user.id, hasPaid: user.hasPaid });

  if (updated.length === 0) {
    return { error: "Target user not found" };
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true, user: updated[0] };
}

/**
 * Updates the system role ('admin' | 'user') for a target user.
 * Protected by verifySession() (Attack 1 prevention) and admin role check.
 */
export async function setUserRole(targetUserId: string, role: "admin" | "user") {
  // ATTACK 1 PREVENTION: Strict session check; unauthenticated calls are rejected immediately
  const { user: currentUser } = await verifySession();

  // ROLE GUARD: Only users with the 'admin' role are authorized to alter roles
  if (currentUser.role !== "admin") {
    return { error: "Unauthorized: Admin role required" };
  }

  if (role !== "admin" && role !== "user") {
    return { error: "Invalid role specified" };
  }

  if (targetUserId === currentUser.id && role !== "admin") {
    return { error: "Cannot revoke your own administrative privileges" };
  }

  const updated = await db
    .update(user)
    .set({ role, updatedAt: new Date() })
    .where(eq(user.id, targetUserId))
    .returning({ id: user.id, role: user.role });

  if (updated.length === 0) {
    return { error: "Target user not found" };
  }

  revalidatePath("/admin");
  return { success: true, user: updated[0] };
}


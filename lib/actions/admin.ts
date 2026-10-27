"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { exams, questions, user } from "@/db/schema";
import { verifySession } from "@/lib/dal";

export async function createExam(input: unknown) {
  const { user: currentUser } = await verifySession();
  if (currentUser.role !== "admin") return { error: "Unauthorized: Admin role required." };
  if (!input || typeof input !== "object") return { error: "Enter valid exam details." };

  const payload = input as Record<string, unknown>;
  const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
  const year = typeof payload.year === "string" ? payload.year.trim() : "";
  const isPremium = payload.isPremium;
  const rawQuestions = payload.questions;

  if (!subject || subject.length > 80) return { error: "Subject must be between 1 and 80 characters." };
  if (!year || year.length > 40) return { error: "Year must be between 1 and 40 characters." };
  if (typeof isPremium !== "boolean") return { error: "Choose whether this exam is free or premium." };
  if (!Array.isArray(rawQuestions) || rawQuestions.length < 1 || rawQuestions.length > 100) {
    return { error: "An exam must contain between 1 and 100 questions." };
  }

  const normalizedQuestions: Array<{
    prompt: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string | null;
  }> = [];
  for (const item of rawQuestions) {
    if (!item || typeof item !== "object") return { error: "Every question must include its text and four options." };
    const question = item as Record<string, unknown>;
    const prompt = typeof question.prompt === "string" ? question.prompt.trim() : "";
    const explanation = typeof question.explanation === "string" ? question.explanation.trim() : "";
    const options = question.options;
    const correctOptionIndex = question.correctOptionIndex;

    if (!prompt || prompt.length > 2000) return { error: "Each question must have text no longer than 2,000 characters." };
    if (!Array.isArray(options) || options.length !== 4 || !options.every((option) =>
      typeof option === "string" && option.trim().length > 0 && option.trim().length <= 500
    )) {
      return { error: "Each question needs four non-empty answer options, each no longer than 500 characters." };
    }
    if (!Number.isInteger(correctOptionIndex) || (correctOptionIndex as number) < 0 || (correctOptionIndex as number) > 3) {
      return { error: "Select one correct option for every question." };
    }
    if (explanation.length > 4000) return { error: "Explanations must be no longer than 4,000 characters." };

    normalizedQuestions.push({
      prompt,
      options: options.map((option: string) => option.trim()),
      correctOptionIndex: correctOptionIndex as number,
      explanation: explanation || null,
    });
  }

  try {
    const createdExam = await db.transaction(async (tx) => {
      const [exam] = await tx.insert(exams).values({
        subject,
        year,
        totalQuestions: normalizedQuestions.length,
        isPremium,
      }).onConflictDoNothing({ target: [exams.subject, exams.year] }).returning({ id: exams.id });

      if (!exam) return null;

      await tx.insert(questions).values(normalizedQuestions.map((question) => ({
        ...question,
        examId: exam.id,
      })));
      return exam;
    });

    if (!createdExam) return { error: "An exam for this subject and year already exists." };
    revalidatePath("/exams");
    revalidatePath(`/exams/${encodeURIComponent(subject)}`);
    revalidatePath("/admin");
    revalidatePath("/sitemap.xml");
    return { success: true, examId: createdExam.id };
  } catch (error) {
    console.error("Failed to create exam:", error);
    return { error: "We could not save this exam. Please try again." };
  }
}

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


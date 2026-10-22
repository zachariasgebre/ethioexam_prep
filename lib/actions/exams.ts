"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { exams, userProgress } from "@/db/schema";
import { verifySession } from "@/lib/dal";

export async function submitExamAttempt(examId: string, score: number, totalQuestions: number) {
  const { user } = await verifySession();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(examId)) {
    return { error: "Invalid exam" };
  }
  if (!Number.isInteger(score) || !Number.isInteger(totalQuestions) || totalQuestions < 1 || score < 0 || score > totalQuestions) {
    return { error: "Invalid score" };
  }
  const [exam] = await db.select({ id: exams.id, totalQuestions: exams.totalQuestions }).from(exams).where(eq(exams.id, examId)).limit(1);
  if (!exam || exam.totalQuestions !== totalQuestions) return { error: "Exam not found or invalid question count" };

  const [attempt] = await db.insert(userProgress).values({ userId: user.id, examId, score, totalQuestions }).returning({ id: userProgress.id });
  revalidatePath("/dashboard");
  return { success: true, attemptId: attempt.id };
}

export async function deleteUserProgress(progressId: string) {
  const { user } = await verifySession();
  const deleted = await db.delete(userProgress)
    .where(and(eq(userProgress.id, progressId), eq(userProgress.userId, user.id)))
    .returning({ id: userProgress.id });
  if (deleted.length === 0) return { error: "Record not found or unauthorized" };
  revalidatePath("/dashboard");
  return { success: true };
}

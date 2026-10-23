"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { exams, questions, userProgress } from "@/db/schema";
import { verifySession } from "@/lib/dal";

export async function getUserProgress() {
  const { user } = await verifySession();
  return db.select({
    id: userProgress.id,
    score: userProgress.score,
    totalQuestions: userProgress.totalQuestions,
    completedAt: userProgress.completedAt,
    subject: exams.subject,
    year: exams.year,
  }).from(userProgress)
    .innerJoin(exams, eq(userProgress.examId, exams.id))
    .where(eq(userProgress.userId, user.id))
    .orderBy(desc(userProgress.completedAt))
    .then((attempts) => attempts.map((attempt) => ({
      ...attempt,
      completedAt: attempt.completedAt.toISOString(),
    })));
}

export async function submitExamAttempt(
  examId: string,
  answers: Array<{ questionId: string; selectedOptionIndex: number }>,
) {
  const { user } = await verifySession();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(examId)) {
    return { error: "Invalid exam" };
  }
  if (
    !Array.isArray(answers) ||
    answers.length === 0 ||
    answers.some((answer) =>
      typeof answer?.questionId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(answer.questionId) ||
      !Number.isInteger(answer.selectedOptionIndex) ||
      answer.selectedOptionIndex < 0
    ) ||
    new Set(answers.map((answer) => answer.questionId)).size !== answers.length
  ) {
    return { error: "Invalid answers" };
  }
  const [exam] = await db.select({ id: exams.id, totalQuestions: exams.totalQuestions }).from(exams).where(eq(exams.id, examId)).limit(1);
  if (!exam || exam.totalQuestions !== answers.length) return { error: "Exam not found or invalid question count" };

  const examQuestions = await db.select({
    id: questions.id,
    correctOptionIndex: questions.correctOptionIndex,
    options: questions.options,
  }).from(questions).where(eq(questions.examId, examId));
  if (
    examQuestions.length !== exam.totalQuestions ||
    examQuestions.some((question) =>
      !Array.isArray(question.options) ||
      question.correctOptionIndex < 0 ||
      question.options.length <= question.correctOptionIndex
    )
  ) {
    return { error: "Exam questions are unavailable" };
  }

  const answerMap = new Map(answers.map(({ questionId, selectedOptionIndex }) => [questionId, selectedOptionIndex]));
  if (examQuestions.some((question) => !answerMap.has(question.id))) {
    return { error: "Please answer every question before submitting" };
  }
  if (examQuestions.some((question) => answerMap.get(question.id)! >= question.options.length)) {
    return { error: "Invalid answer option" };
  }

  const score = examQuestions.reduce(
    (total, question) => total + Number(answerMap.get(question.id) === question.correctOptionIndex),
    0,
  );
  const [attempt] = await db.insert(userProgress).values({
    userId: user.id,
    examId,
    score,
    totalQuestions: exam.totalQuestions,
  }).returning({ id: userProgress.id });
  revalidatePath("/dashboard");
  return { success: true, attemptId: attempt.id, score, totalQuestions: exam.totalQuestions };
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

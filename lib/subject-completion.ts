import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { exams, userProgress } from "@/db/schema";

/** One aggregate row per subject; attempt rows never leave PostgreSQL. */
export async function getSubjectCompletion(userId: string | null) {
  const joinCondition = and(
    eq(userProgress.examId, exams.id),
    userId ? eq(userProgress.userId, userId) : sql`false`,
  );

  return db.select({
    subject: exams.subject,
    totalYears: sql<number>`count(distinct ${exams.year})::int`,
    attemptedYears: sql<number>`count(distinct case when ${userProgress.id} is not null then ${exams.year} end)::int`,
  })
    .from(exams)
    .leftJoin(userProgress, joinCondition)
    .groupBy(exams.subject)
    .orderBy(exams.subject);
}

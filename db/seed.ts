import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { exams, questions } from "./schema";
import { sampleExamFixtures } from "@/lib/fixtures";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to seed the database");

async function seed() {
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);
  try {
    for (const fixture of sampleExamFixtures) {
      const [existing] = await db
        .select({ id: exams.id })
        .from(exams)
        .where(and(eq(exams.subject, fixture.subject), eq(exams.year, fixture.year)))
        .limit(1);

      const [exam] = existing
        ? await db
            .update(exams)
            .set({ totalQuestions: fixture.questions.length })
            .where(eq(exams.id, existing.id))
            .returning({ id: exams.id })
        : await db
            .insert(exams)
            .values({
              subject: fixture.subject,
              year: fixture.year,
              totalQuestions: fixture.questions.length,
              isPremium: false,
            })
            .returning({ id: exams.id });

      await db.delete(questions).where(eq(questions.examId, exam.id));
      await db.insert(questions).values(
        fixture.questions.map((question) => ({
          ...question,
          examId: exam.id,
        }))
      );
    }
    console.log("Successfully seeded national exam sample papers.");
  } finally {
    await pool.end();
  }
}

seed().catch((error: unknown) => {
  console.error("Database seed failed", error);
  process.exitCode = 1;
});

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { db, pool } from "./connection";
import { account as authAccount, exams, questions, user as authUser } from "./schema";
import { examSeedData } from "./seed-data";

const demoAccounts = [
  { name: "EthioExam Admin", email: "admin@ethioexam.com", role: "admin", hasPaid: true },
  { name: "Paid Student", email: "student.paid@ethioexam.com", role: "user", hasPaid: true },
  { name: "Unpaid Student", email: "student.unpaid@ethioexam.com", role: "user", hasPaid: false },
] as const;
const demoPassword = "password123";

async function seedDemoAccounts() {
  for (const demoAccount of demoAccounts) {
    const passwordHash = await hashPassword(demoPassword);
    await db.transaction(async (tx) => {
      const [existingUser] = await tx.select({ id: authUser.id }).from(authUser)
        .where(eq(authUser.email, demoAccount.email)).limit(1);
      const userId = existingUser?.id ?? randomUUID();
      const now = new Date();

      if (existingUser) {
        await tx.update(authUser).set({
          name: demoAccount.name,
          role: demoAccount.role,
          hasPaid: demoAccount.hasPaid,
          updatedAt: now,
        }).where(eq(authUser.id, userId));
      } else {
        await tx.insert(authUser).values({
          id: userId,
          name: demoAccount.name,
          email: demoAccount.email,
          emailVerified: false,
          role: demoAccount.role,
          hasPaid: demoAccount.hasPaid,
          createdAt: now,
          updatedAt: now,
        });
      }

      const [credentialAccount] = await tx.select({ id: authAccount.id }).from(authAccount)
        .where(and(eq(authAccount.userId, userId), eq(authAccount.providerId, "credential"))).limit(1);
      if (credentialAccount) {
        await tx.update(authAccount).set({
          accountId: userId,
          password: passwordHash,
          updatedAt: now,
        }).where(eq(authAccount.id, credentialAccount.id));
      } else {
        await tx.insert(authAccount).values({
          id: randomUUID(),
          accountId: userId,
          providerId: "credential",
          userId,
          password: passwordHash,
          createdAt: now,
          updatedAt: now,
        });
      }
    });
  }
}

async function seed() {
  let inserted = 0;
  let skipped = 0;

  for (const fixture of examSeedData) {
    const created = await db.transaction(async (tx) => {
      const [exam] = await tx.insert(exams).values({
        subject: fixture.subject,
        year: fixture.year,
        totalQuestions: fixture.questions.length,
        isPremium: false,
      }).onConflictDoNothing({ target: [exams.subject, exams.year] }).returning({ id: exams.id });

      if (!exam) return false;

      await tx.insert(questions).values(fixture.questions.map((question) => ({
        examId: exam.id,
        prompt: question.prompt,
        options: question.options,
        correctOptionIndex: question.correctOptionIndex,
        explanation: question.explanation,
      })));
      return true;
    });

    if (created) inserted += 1;
    else skipped += 1;
  }

  console.log(`Seed complete: added ${inserted} exams; skipped ${skipped} existing exams.`);
  if (process.env.NODE_ENV === "production") {
    console.log("Skipping fixed-password test accounts in production.");
  } else {
    await seedDemoAccounts();
    console.log(`Ensured ${demoAccounts.length} local Better Auth test accounts.`);
  }
}

seed().then(() => pool.end()).catch(async (error: unknown) => {
  console.error("Exam seed failed:", error);
  await pool.end();
  process.exitCode = 1;
});

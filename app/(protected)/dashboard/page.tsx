import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { exams, userProgress } from "@/db/schema";
import { verifySession } from "@/lib/dal";
import { DeleteProgressButton } from "@/components/delete-progress-button";

export default async function DashboardPage() {
  const { user } = await verifySession();
  const attempts = await db.select({
    id: userProgress.id,
    score: userProgress.score,
    totalQuestions: userProgress.totalQuestions,
    completedAt: userProgress.completedAt,
    subject: exams.subject,
    year: exams.year,
  }).from(userProgress)
    .innerJoin(exams, eq(userProgress.examId, exams.id))
    .where(eq(userProgress.userId, user.id))
    .orderBy(desc(userProgress.completedAt));
  const totalScore = attempts.reduce((total, attempt) => total + attempt.score, 0);
  const totalQuestions = attempts.reduce((total, attempt) => total + attempt.totalQuestions, 0);
  const averagePerformance = totalQuestions === 0 ? 0 : Math.round((totalScore / totalQuestions) * 100);

  return <main className="mx-auto max-w-5xl px-6 py-16">
    <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
    <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Your progress">
      <article className="rounded-xl border bg-white p-5"><h2 className="text-sm text-slate-600">Average performance</h2><p className="mt-2 text-2xl font-bold">{averagePerformance}%</p></article>
      <article className="rounded-xl border bg-white p-5"><h2 className="text-sm text-slate-600">Quizzes completed</h2><p className="mt-2 text-2xl font-bold">{attempts.length}</p></article>
      <article className="rounded-xl border bg-white p-5"><h2 className="text-sm text-slate-600">Subscription</h2><p className="mt-2 text-2xl font-bold">{user.hasPaid ? "Premium" : "Free"}</p></article>
    </section>
    <section className="mt-10">
      <h2 className="text-2xl font-semibold">Completed tests</h2>
      {attempts.length === 0 ? <p className="mt-4 text-slate-600">You have not completed any quizzes yet.</p> : (
        <ul className="mt-4 space-y-3">
          {attempts.map((attempt) => (
            <li key={attempt.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-5">
              <div>
                <h3 className="font-semibold">{attempt.subject} · {attempt.year}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {attempt.score}/{attempt.totalQuestions} correct ({Math.round((attempt.score / attempt.totalQuestions) * 100)}%) · {attempt.completedAt.toLocaleDateString()}
                </p>
              </div>
              <DeleteProgressButton progressId={attempt.id} />
            </li>
          ))}
        </ul>
      )}
    </section>
  </main>;
}

import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { exams, user as userTable, userProgress } from "@/db/schema";
import { verifySession } from "@/lib/dal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DeleteProgressButton } from "@/components/delete-progress-button";

export const metadata = {
  title: "Student Dashboard | EthioExam Prep",
  description: "View your national exam practice progress, average scores, and test history.",
};

export default async function DashboardPage() {
  // Layer 2: Server-side Data Access Layer verification (Attack 1 prevention)
  const { user: sessionUser } = await verifySession();

  let hasPaid = false;
  let userRole = sessionUser.role ?? "user";
  let attempts: Array<{
    id: string;
    score: number;
    totalQuestions: number;
    completedAt: Date;
    subject: string;
    year: string;
  }> = [];

  try {
    const [dbUser] = await db
      .select({
        role: userTable.role,
        hasPaid: userTable.hasPaid,
      })
      .from(userTable)
      .where(eq(userTable.id, sessionUser.id))
      .limit(1);

    if (dbUser) {
      hasPaid = dbUser.hasPaid;
      userRole = dbUser.role;
    }

    attempts = await db
      .select({
        id: userProgress.id,
        score: userProgress.score,
        totalQuestions: userProgress.totalQuestions,
        completedAt: userProgress.completedAt,
        subject: exams.subject,
        year: exams.year,
      })
      .from(userProgress)
      .innerJoin(exams, eq(userProgress.examId, exams.id))
      .where(eq(userProgress.userId, sessionUser.id))
      .orderBy(desc(userProgress.completedAt));
  } catch (err) {
    console.warn("Database unreachable in DashboardPage:", err);
  }

  const totalAttempts = attempts.length;
  const averagePercentage =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce(
            (sum, a) => sum + (a.totalQuestions > 0 ? (a.score / a.totalQuestions) * 100 : 0),
            0
          ) / totalAttempts
        )
      : 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* Dashboard Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Student Portal</span>
            {userRole === "admin" && (
              <Badge className="bg-purple-100 text-purple-800">Admin Account</Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome, {sessionUser.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Track your Ethiopian national examination preparation milestones and accuracy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {userRole === "admin" && (
            <Link
              href="/admin"
              className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800"
            >
              Admin Portal →
            </Link>
          )}
          <Link
            href="/exams"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Practice Exams
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <section aria-label="Student Progress Summary" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Quizzes Completed</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalAttempts}</p>
          </div>
          <p className="mt-3 text-xs text-slate-500">Total national exam attempts logged</p>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Average Performance</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {totalAttempts > 0 ? `${averagePercentage}%` : "—"}
            </p>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {totalAttempts > 0 ? "Overall accuracy across subjects" : "Complete an exam to see score"}
          </p>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Subscription Status</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {hasPaid ? "Premium" : "Free Tier"}
              </span>
              <Badge className={hasPaid ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}>
                {hasPaid ? "Full Access" : "Standard"}
              </Badge>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {hasPaid
              ? "All past papers unlocked"
              : "Upgrade via Admin portal to access premium exams"}
          </p>
        </Card>
      </section>

      {/* Test History Section */}
      <section aria-label="Exam History" className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Past Exam Attempts</h2>
          {totalAttempts > 0 && (
            <span className="text-xs font-medium text-slate-500">
              Showing {totalAttempts} recorded session{totalAttempts === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {totalAttempts === 0 ? (
          /* Empty State Card for brand-new student accounts with zero test history */
          <Card className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">No exam attempts yet</h3>
            <p className="mt-2 max-w-md text-sm text-slate-600 leading-relaxed">
              You haven&apos;t taken any national practice exams yet. Choose a subject and year to start practicing, test
              your accuracy against official answer keys, and your diagnostic analytics will appear here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Physics 2015 E.C.</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Mathematics 2016 E.C.</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Biology 2016 E.C.</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Chemistry 2016 E.C.</span>
            </div>
            <div className="mt-8">
              <Link
                href="/exams"
                className="inline-flex items-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Browse available exams →
              </Link>
            </div>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th scope="col" className="px-6 py-4">Exam Paper</th>
                    <th scope="col" className="px-6 py-4">Score</th>
                    <th scope="col" className="px-6 py-4">Accuracy</th>
                    <th scope="col" className="px-6 py-4">Date Completed</th>
                    <th scope="col" className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((attempt) => {
                    const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                    const examTitle = `${attempt.subject} · ${attempt.year}`;
                    return (
                      <tr key={attempt.id} className="transition hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <Link
                            href={`/exams/${encodeURIComponent(attempt.subject)}/${encodeURIComponent(attempt.year)}`}
                            className="font-semibold text-emerald-800 hover:underline"
                          >
                            {examTitle}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                          {attempt.score} / {attempt.totalQuestions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={
                              percentage >= 70
                                ? "bg-emerald-50 text-emerald-800"
                                : percentage >= 50
                                ? "bg-amber-50 text-amber-800"
                                : "bg-rose-50 text-rose-800"
                            }
                          >
                            {percentage}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {new Date(attempt.completedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <DeleteProgressButton
                            progressId={attempt.id}
                            examTitle={examTitle}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

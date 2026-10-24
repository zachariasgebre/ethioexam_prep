import Link from "next/link";
import { db } from "@/db";
import { exams } from "@/db/schema";
import { sampleExamFixtures } from "@/lib/fixtures";

export const metadata = {
  title: "National Exams | EthioExam Prep",
  description: "Browse Ethiopian national examination papers by subject and year.",
};

export default async function ExamsPage() {
  let availableExams: Array<{
    id: string;
    subject: string;
    year: string;
    totalQuestions: number;
    isPremium: boolean;
  }> = [];
  let isDatabaseOffline = false;

  try {
    availableExams = await db.select().from(exams).orderBy(exams.subject, exams.year);
  } catch (error) {
    // Database connection error (e.g. ECONNREFUSED when PostgreSQL is not running locally)
    console.warn("Database unreachable in ExamsPage, using sample exam fixtures:", error);
    isDatabaseOffline = true;
    availableExams = sampleExamFixtures.map((f, i) => ({
      id: `preview-${i}`,
      subject: f.subject,
      year: f.year,
      totalQuestions: f.questions.length,
      isPremium: false,
    }));
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-emerald-700 hover:underline">
            Home
          </Link>
          <span className="text-xs text-slate-400">/</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Exams</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">National Examinations</h1>
        <p className="text-sm text-slate-600">
          Select an Ethiopian national exam paper to begin your timed practice and review answer explanations.
        </p>
      </div>

      {/* Database Offline Notice Banner */}
      {isDatabaseOffline && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl" aria-hidden="true">⚠️</span>
            <div className="space-y-1">
              <p className="font-bold">PostgreSQL Server Offline (Showing Preloaded Exams)</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                The application could not reach a PostgreSQL database on <code>localhost:5432</code> (<code>ECONNREFUSED</code>).
                Preloaded sample national exam papers are displayed below so you can explore and practice.
              </p>
              <p className="text-xs text-amber-700">
                To persist user accounts and test progress, configure your <code>DATABASE_URL</code> in <code>.env.local</code> and run <code>npm run db:push</code> &amp; <code>npm run db:seed</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Exam Grid */}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {availableExams.map((exam) => (
          <li
            key={exam.id}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-600 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Grade 12 Matriculation
                </span>
                {exam.isPremium ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    Premium
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    Free
                  </span>
                )}
              </div>

              <Link
                className="mt-2 block text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition"
                href={`/exams/${encodeURIComponent(exam.subject)}/${encodeURIComponent(exam.year)}`}
              >
                {exam.subject} · {exam.year}
              </Link>

              <p className="mt-2 text-xs text-slate-500">
                {exam.totalQuestions} multiple-choice questions with answer rationale
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Diagnostic Practice</span>
              <Link
                href={`/exams/${encodeURIComponent(exam.subject)}/${encodeURIComponent(exam.year)}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:underline"
              >
                Start Practice Exam →
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {availableExams.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-600">No exams have been added yet.</p>
        </div>
      )}
    </main>
  );
}

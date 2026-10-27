import Link from "next/link";
import { db } from "@/db";
import { exams } from "@/db/schema";
import { sampleExamFixtures } from "@/lib/fixtures";

export const metadata = {
  title: "National Exams | EthioExam Prep",
  description: "Browse Ethiopian national exam papers by subject and year.",
};

export default async function ExamsPage() {
  let availableExams: Array<{ id: string; subject: string; year: string; totalQuestions: number }> = [];
  let isDatabaseOffline = false;

  try {
    availableExams = await db.select({
      id: exams.id,
      subject: exams.subject,
      year: exams.year,
      totalQuestions: exams.totalQuestions,
    }).from(exams).orderBy(exams.subject, exams.year);
  } catch (error) {
    console.warn("Database unreachable in ExamsPage, using sample exam fixtures:", error);
    isDatabaseOffline = true;
    availableExams = sampleExamFixtures.map((fixture, index) => ({
      id: `preview-${index}`,
      subject: fixture.subject,
      year: fixture.year,
      totalQuestions: fixture.questions.length,
    }));
  }

  const subjectGroups = Array.from(
    availableExams.reduce((groups, exam) => {
      groups.set(exam.subject, (groups.get(exam.subject) ?? 0) + 1);
      return groups;
    }, new Map<string, number>()),
  ).sort(([first], [second]) => first.localeCompare(second));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="border-b border-slate-200 pb-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
          <Link href="/" className="font-medium text-emerald-700 hover:underline">Home</Link>
          <span className="px-2" aria-hidden="true">/</span>
          <span aria-current="page">Exams</span>
        </nav>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Choose a subject</h1>
        <p className="mt-2 text-slate-600">Choose a subject to browse available national exam years and start practicing.</p>
      </header>

      {isDatabaseOffline && (
        <div role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          The database is unavailable. Showing sample subjects for preview; exam papers require a database connection.
        </div>
      )}

      {subjectGroups.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjectGroups.map(([subject, examCount]) => (
            <li key={subject}>
              <Link
                href={`/exams/${encodeURIComponent(subject)}`}
                className="group flex h-full min-h-40 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-600 hover:shadow-md"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Grade 12 Matriculation</span>
                  <h2 className="mt-3 text-2xl font-bold text-slate-900 group-hover:text-emerald-700">{subject}</h2>
                </div>
                <span className="mt-6 text-sm text-slate-600">
                  {examCount} exam {examCount === 1 ? "year" : "years"}
                  <span aria-hidden="true"> · Browse years →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center sm:p-12">
          <p className="text-slate-600">No subjects have exams yet.</p>
        </div>
      )}
    </main>
  );
}

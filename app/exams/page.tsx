import Link from "next/link";
import { CircularProgress } from "@/components/circular-progress";
import { getCurrentSession } from "@/lib/current-session";
import { sampleExamFixtures } from "@/lib/fixtures";
import { getSubjectCompletion } from "@/lib/subject-completion";

export const metadata = {
  title: "National Exams | EthioExam Prep",
  description: "Browse Ethiopian national exam papers by subject and year.",
};

type SubjectSummary = { subject: string; totalYears: number; attemptedYears: number };
const subjectCardColors = [
  "border-emerald-200 from-emerald-50 via-white to-cyan-50 hover:border-emerald-400",
  "border-sky-200 from-sky-50 via-white to-indigo-50 hover:border-sky-400",
  "border-amber-200 from-amber-50 via-white to-orange-50 hover:border-amber-400",
  "border-fuchsia-200 from-fuchsia-50 via-white to-pink-50 hover:border-fuchsia-400",
  "border-violet-200 from-violet-50 via-white to-blue-50 hover:border-violet-400",
];

export default async function ExamsPage() {
  let subjectGroups: SubjectSummary[] = [];
  let isDatabaseOffline = false;

  try {
    const session = await getCurrentSession().catch(() => null);
    const summary = await getSubjectCompletion(session?.user.id ?? null);
    subjectGroups = summary.map((row) => ({ subject: row.subject, totalYears: row.totalYears, attemptedYears: row.attemptedYears }));
  } catch (error) {
    console.warn("Database unreachable in ExamsPage, using sample exam fixtures:", error);
    isDatabaseOffline = true;
    subjectGroups = Array.from(new Set(sampleExamFixtures.map((fixture) => fixture.subject)))
      .sort((first, second) => first.localeCompare(second))
      .map((subject) => ({
        subject,
        totalYears: new Set(sampleExamFixtures.filter((fixture) => fixture.subject === subject).map((fixture) => fixture.year)).size,
        attemptedYears: 0,
      }));
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm sm:p-7">
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
          {subjectGroups.map(({ subject, totalYears, attemptedYears }, index) => {
            const percentage = totalYears === 0 ? 0 : Math.round((attemptedYears / totalYears) * 100);
            const color = subjectCardColors[index % subjectCardColors.length];
            return (
            <li key={subject}>
              <Link
                href={`/exams/${encodeURIComponent(subject)}`}
                className={`ui-card ui-card-interactive group colorful-card flex h-full min-h-44 flex-col justify-between bg-gradient-to-br p-6 ${color}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Grade 12 Matriculation</span>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900 group-hover:text-emerald-700">{subject}</h2>
                  </div>
                  <CircularProgress percentage={percentage} label={`${attemptedYears} of ${totalYears} exam years attempted`} />
                </div>
                <span className="mt-6 text-sm text-slate-600">
                  {totalYears} exam {totalYears === 1 ? "year" : "years"}
                  <span aria-hidden="true"> · Browse years →</span>
                </span>
              </Link>
            </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center sm:p-12">
          <p className="text-slate-600">No subjects have exams yet.</p>
        </div>
      )}
    </main>
  );
}

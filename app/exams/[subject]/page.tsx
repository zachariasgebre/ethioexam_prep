import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/db";
import { exams } from "@/db/schema";
import { decodeRouteSegment } from "@/lib/decode-route-segment";

type SubjectParams = { subject: string };

export async function generateMetadata({ params }: { params: Promise<SubjectParams> }): Promise<Metadata> {
  const { subject: rawSubject } = await params;
  const subject = decodeRouteSegment(rawSubject);
  return {
    title: `${subject} Exams | EthioExam Prep`,
    description: `Choose a year and practice Ethiopian national ${subject} exam papers.`,
  };
}

export default async function SubjectExamsPage({ params }: { params: Promise<SubjectParams> }) {
  const { subject: rawSubject } = await params;
  const subject = decodeRouteSegment(rawSubject);
  const availableExams = await db.select({
    id: exams.id,
    year: exams.year,
    totalQuestions: exams.totalQuestions,
    isPremium: exams.isPremium,
  }).from(exams).where(eq(exams.subject, subject)).orderBy(desc(exams.year));

  if (availableExams.length === 0) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="border-b border-slate-200 pb-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
          <Link href="/" className="font-medium text-emerald-700 hover:underline">Home</Link>
          <span className="px-2" aria-hidden="true">/</span>
          <Link href="/exams" className="font-medium text-emerald-700 hover:underline">Exams</Link>
          <span className="px-2" aria-hidden="true">/</span>
          <span aria-current="page">{subject}</span>
        </nav>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{subject} exam years</h1>
        <p className="mt-2 text-slate-600">Choose an exam year to open the paper and practice at your own pace.</p>
      </header>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableExams.map((exam) => (
          <li key={exam.id}>
            <Link
              href={`/exams/${encodeURIComponent(subject)}/${encodeURIComponent(exam.year)}`}
              className="group block h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-600 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700">{exam.year}</h2>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${exam.isPremium ? "bg-amber-100 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>
                  {exam.isPremium ? "Premium" : "Free"}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{exam.totalQuestions} multiple-choice questions</p>
              <span className="mt-6 inline-flex font-semibold text-emerald-700 group-hover:underline">Open exam <span aria-hidden="true" className="ml-1">→</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

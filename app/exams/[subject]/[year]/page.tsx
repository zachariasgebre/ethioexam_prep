import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { exams, questions } from "@/db/schema";
import { ExamQuizRunner } from "@/components/exam-quiz-runner";
import { sampleExamFixtures } from "@/lib/fixtures";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; year: string }>;
}) {
  const { subject, year } = await params;
  return {
    title: `${decodeURIComponent(subject)} ${decodeURIComponent(year)} | EthioExam Prep`,
    description: `Practice Ethiopian national exam questions for ${decodeURIComponent(
      subject
    )} (${decodeURIComponent(year)}).`,
  };
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ subject: string; year: string }>;
}) {
  const { subject, year } = await params;
  const decodedSubject = decodeURIComponent(subject);
  const decodedYear = decodeURIComponent(year);

  let examData: {
    id: string;
    subject: string;
    year: string;
    totalQuestions: number;
  } | null = null;

  let examQuestions: Array<{
    id: string;
    prompt: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string | null;
  }> = [];

  let isOfflineFallback = false;

  try {
    const [dbExam] = await db
      .select()
      .from(exams)
      .where(and(eq(exams.subject, decodedSubject), eq(exams.year, decodedYear)))
      .limit(1);

    if (dbExam) {
      examData = {
        id: dbExam.id,
        subject: dbExam.subject,
        year: dbExam.year,
        totalQuestions: dbExam.totalQuestions,
      };

      examQuestions = await db
        .select({
          id: questions.id,
          prompt: questions.prompt,
          options: questions.options,
          correctOptionIndex: questions.correctOptionIndex,
          explanation: questions.explanation,
        })
        .from(questions)
        .where(eq(questions.examId, dbExam.id));
    }
  } catch (error) {
    console.warn("Database query failed in ExamPage, checking sample fixtures:", error);
    isOfflineFallback = true;
  }

  // If not found in database or database is offline, fall back to sample fixtures
  if (!examData || examQuestions.length === 0) {
    const fixture = sampleExamFixtures.find(
      (f) =>
        f.subject.toLowerCase() === decodedSubject.toLowerCase() &&
        f.year.toLowerCase() === decodedYear.toLowerCase()
    );

    if (!fixture) {
      notFound();
    }

    isOfflineFallback = true;
    examData = {
      id: `preview-${fixture.subject.toLowerCase()}-${fixture.year.replace(/\s+/g, "-")}`,
      subject: fixture.subject,
      year: fixture.year,
      totalQuestions: fixture.questions.length,
    };

    examQuestions = fixture.questions.map((q, idx) => ({
      id: `preview-q-${idx}`,
      prompt: q.prompt,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
    }));
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Header & Breadcrumbs */}
      <div className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/exams" className="text-emerald-700 hover:underline">
              ← All Exams
            </Link>
            <span>/</span>
            <span>{examData.subject}</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {examData.subject} · {examData.year}
          </h1>
        </div>
        <div className="text-right text-xs text-slate-500">
          <span className="font-semibold text-slate-900">{examData.totalQuestions}</span> Questions
        </div>
      </div>

      {isOfflineFallback && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800"
        >
          <span className="font-bold mr-1">Preloaded Offline Exam:</span>
          You are practicing with preloaded sample national exam questions. To log scores permanently to your student dashboard, connect PostgreSQL in <code>.env.local</code>.
        </div>
      )}

      {/* Interactive Quiz Runner */}
      <ExamQuizRunner
        exam={examData}
        questions={examQuestions}
      />
    </main>
  );
}

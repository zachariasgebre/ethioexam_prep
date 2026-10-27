import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExamQuizRunner } from "@/components/exam-quiz-runner";
import { db } from "@/db";
import { exams, questions } from "@/db/schema";
import { decodeRouteSegment } from "@/lib/decode-route-segment";
import { verifyPaidSession } from "@/lib/dal";

type ExamParams = { subject: string; year: string };

export async function generateMetadata({ params }: { params: Promise<ExamParams> }): Promise<Metadata> {
  const { subject: rawSubject, year: rawYear } = await params;
  const subject = decodeRouteSegment(rawSubject);
  const year = decodeRouteSegment(rawYear);
  return {
    title: `${subject} ${year} Practice Exam | EthioExam Prep`,
    description: `Practice the ${subject} ${year} Ethiopian national exam with interactive questions and instant explanations.`,
  };
}

export default async function ExamPage({ params }: { params: Promise<ExamParams> }) {
  await verifyPaidSession();
  const { subject: rawSubject, year: rawYear } = await params;
  const subject = decodeRouteSegment(rawSubject);
  const year = decodeRouteSegment(rawYear);
  const [exam] = await db.select().from(exams)
    .where(and(eq(exams.subject, subject), eq(exams.year, year)))
    .limit(1);
  if (!exam) notFound();

  const examQuestions = await db.select({
    id: questions.id,
    prompt: questions.prompt,
    options: questions.options,
  }).from(questions)
    .where(eq(questions.examId, exam.id))
    .orderBy(questions.id);
  if (examQuestions.length !== exam.totalQuestions) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="border-b border-slate-200 pb-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
          <Link href="/" className="font-medium text-emerald-700 hover:underline">Home</Link>
          <span className="px-2" aria-hidden="true">/</span>
          <Link href="/exams" className="font-medium text-emerald-700 hover:underline">Exams</Link>
          <span className="px-2" aria-hidden="true">/</span>
          <Link href={`/exams/${encodeURIComponent(exam.subject)}`} className="font-medium text-emerald-700 hover:underline">{exam.subject}</Link>
          <span className="px-2" aria-hidden="true">/</span>
          <span aria-current="page">{exam.year}</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{exam.subject} - {exam.year}</h1>
        <p className="mt-2 text-slate-600">{exam.totalQuestions} questions. Scroll through the paper and reveal an explanation whenever you are ready.</p>
      </header>
      <ExamQuizRunner examId={exam.id} questions={examQuestions} />
    </main>
  );
}

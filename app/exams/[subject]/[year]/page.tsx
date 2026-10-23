import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { exams, questions } from "@/db/schema";
import { ExamQuizRunner } from "@/components/exam-quiz-runner";

export default async function ExamPage({ params }: { params: Promise<{ subject: string; year: string }> }) {
  const { subject, year } = await params;
  const [exam] = await db.select().from(exams).where(and(eq(exams.subject, decodeURIComponent(subject)), eq(exams.year, decodeURIComponent(year)))).limit(1);
  if (!exam) notFound();
  const examQuestions = await db.select({
    id: questions.id,
    prompt: questions.prompt,
    options: questions.options,
  }).from(questions).where(eq(questions.examId, exam.id)).orderBy(questions.id);
  if (examQuestions.length !== exam.totalQuestions) notFound();

  return <main className="mx-auto max-w-3xl px-6 py-16">
    <h1 className="text-3xl font-bold">{exam.subject} · {exam.year}</h1>
    <p className="mt-3 text-slate-600">{exam.totalQuestions} questions</p>
    <ExamQuizRunner examId={exam.id} questions={examQuestions} />
  </main>;
}

import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { exams } from "@/db/schema";

export default async function ExamPage({ params }: { params: Promise<{ subject: string; year: string }> }) {
  const { subject, year } = await params;
  const [exam] = await db.select().from(exams).where(and(eq(exams.subject, decodeURIComponent(subject)), eq(exams.year, decodeURIComponent(year)))).limit(1);
  if (!exam) notFound();
  return <main className="mx-auto max-w-3xl px-6 py-16"><h1 className="text-3xl font-bold">{exam.subject} · {exam.year}</h1><p className="mt-3 text-slate-600">Quiz runner setup is the next implementation step. {exam.totalQuestions} questions.</p></main>;
}

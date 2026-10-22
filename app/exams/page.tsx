import Link from "next/link";
import { db } from "@/db";
import { exams } from "@/db/schema";

export default async function ExamsPage() {
  const availableExams = await db.select().from(exams).orderBy(exams.subject, exams.year);
  return <main className="mx-auto max-w-5xl px-6 py-16"><h1 className="text-3xl font-bold">National exams</h1><p className="mt-3 text-slate-600">Choose a subject and year to begin.</p><ul className="mt-8 grid gap-4 sm:grid-cols-2">{availableExams.map((exam) => <li key={exam.id} className="rounded-xl border bg-white p-5"><Link className="font-semibold text-emerald-800 underline" href={`/exams/${encodeURIComponent(exam.subject)}/${encodeURIComponent(exam.year)}`}>{exam.subject} · {exam.year}</Link><p className="mt-2 text-sm text-slate-600">{exam.totalQuestions} questions{exam.isPremium ? " · Premium" : ""}</p></li>)}</ul>{availableExams.length === 0 && <p className="mt-8 text-slate-600">No exams have been added yet.</p>}</main>;
}

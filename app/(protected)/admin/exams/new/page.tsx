import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdminExamCreateForm } from "@/components/admin-exam-create-form";
import { verifySession } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Create Exam | EthioExam Prep Admin",
  description: "Add a subject exam and its multiple-choice questions.",
};

export default async function NewAdminExamPage() {
  const { user } = await verifySession();
  if (user.role !== "admin") notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-500">
        <Link href="/admin" className="font-medium text-purple-700 hover:underline">Admin portal</Link>
        <span className="px-2" aria-hidden="true">/</span>
        <span aria-current="page">Create exam</span>
      </nav>
      <header className="mb-8 border-b border-slate-200 pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Admin only</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Create an exam</h1>
        <p className="mt-2 text-slate-600">Add a new subject and year, then enter its questions and answer explanations.</p>
      </header>
      <AdminExamCreateForm />
    </main>
  );
}

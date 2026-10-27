import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activate Exam Access | EthioExam Prep",
  description: "Your account needs activation before you can open exam papers.",
};

export default function PricingPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-4 py-12 sm:px-6">
      <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="activation-heading">
        <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 text-2xl" aria-hidden="true">🔒</div>
        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-amber-800">Account activation required</p>
        <h1 id="activation-heading" className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Unlock exam access</h1>
        <p className="mt-3 leading-7 text-slate-600">
          Your account is not activated for exam practice yet. Ask an EthioExam Prep administrator to enable access for your account, then reopen the exam.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800">
            Go to dashboard
          </Link>
          <Link href="/exams" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
            Browse exam subjects
          </Link>
        </div>
      </section>
    </main>
  );
}

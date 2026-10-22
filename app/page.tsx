import Link from "next/link";

export default function HomePage() {
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">EthioExam Prep</p>
    <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Practice with purpose. Walk into your exams prepared.</h1>
    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">A home for Ethiopian national exam practice, progress tracking, and focused study.</p>
    <div className="mt-9 flex flex-wrap gap-3"><Link className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white" href="/exams">Browse exams</Link><Link className="rounded-lg border border-slate-300 px-5 py-3 font-semibold" href="/sign-in">Sign in</Link></div>
  </main>;
}

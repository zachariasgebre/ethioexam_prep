import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative isolate flex min-h-svh overflow-hidden bg-slate-950 text-white">
      <Image
        src="/classroom-bg.jpg"
        alt="Ethiopian Grade 12 students studying together in a classroom"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[58%_center] sm:object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/20 sm:from-slate-950/85 sm:via-slate-950/55 sm:to-slate-950/10"
      />
      <div className="mx-auto flex w-full max-w-7xl items-center px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <section className="max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300 sm:text-sm">
            EthioExam Prep
          </p>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Practice with purpose. Walk into your exams prepared.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-100 sm:mt-6 sm:text-lg sm:leading-8">
            A home for Ethiopian national exam practice, progress tracking, and focused study.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row sm:mt-9">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline-white"
              href="/exams"
            >
              Browse exams
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/60 bg-slate-950/20 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-white"
              href="/sign-in"
            >
              Sign in
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

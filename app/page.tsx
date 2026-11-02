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
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-10 sm:px-8 sm:py-20 lg:px-12">
        <section className="max-w-2xl rounded-[1.75rem] border border-white/10 bg-slate-950/20 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur-[2px] sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-0">
          <p className="mb-5 inline-flex items-center rounded-full border border-emerald-300/25 bg-emerald-950/45 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200 sm:text-xs">
            Ethiopian exam preparation
          </p>
          <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Practice with purpose. Walk into your exams prepared.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-slate-100 sm:mt-6 sm:text-lg sm:leading-8">
            A home for Ethiopian national exam practice, progress tracking, and focused study.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row sm:mt-9">
            <Link
              className="ui-button ui-button-primary min-h-12 px-6 py-3"
              href="/exams"
            >
              Browse exams
            </Link>
            <Link
              className="ui-button min-h-12 border border-white/50 bg-white/10 px-6 py-3 text-white backdrop-blur-sm hover:bg-white/20"
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

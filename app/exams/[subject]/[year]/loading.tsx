export default function ExamLoading() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-12"
      aria-busy="true"
      aria-label="Loading practice exam"
      role="status"
    >
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 animate-pulse">
        <div className="h-4 w-16 rounded bg-slate-200" />
        <span className="text-slate-300">/</span>
        <div className="h-4 w-28 rounded bg-slate-200" />
      </div>

      {/* Header skeleton */}
      <div className="mt-4 border-b border-slate-200 pb-6 animate-pulse">
        <div className="h-8 w-60 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 rounded bg-slate-100" />
      </div>

      {/* Progress bar skeleton */}
      <div className="mt-6 animate-pulse">
        <div className="flex justify-between text-xs text-slate-400">
          <div className="h-3 w-20 rounded bg-slate-200" />
          <div className="h-3 w-12 rounded bg-slate-200" />
        </div>
        <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200" />
      </div>

      {/* Question Card skeleton */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        {/* Question Counter & Prompt */}
        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-emerald-100" />
          <div className="h-6 w-full rounded bg-slate-200" />
          <div className="h-6 w-3/4 rounded bg-slate-200" />
        </div>

        {/* 4 Option cards */}
        <div className="mt-8 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-4"
            >
              <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
              <div className="h-4 w-4/5 rounded bg-slate-200" />
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="h-10 w-24 rounded-lg bg-slate-200" />
          <div className="h-10 w-28 rounded-lg bg-emerald-200" />
        </div>
      </div>
      <span className="sr-only">Loading exam questions…</span>
    </main>
  );
}

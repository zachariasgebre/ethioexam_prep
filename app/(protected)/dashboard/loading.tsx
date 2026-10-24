export default function DashboardLoading() {
  return (
    <main
      className="mx-auto max-w-5xl px-6 py-12"
      aria-busy="true"
      aria-label="Loading student dashboard"
      role="status"
    >
      {/* Header skeleton */}
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between animate-pulse">
        <div>
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-64 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-80 rounded bg-slate-100" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-slate-200" />
      </div>

      {/* KPI Cards skeleton */}
      <section aria-label="Metrics loading" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
            <div className="h-3 w-28 rounded bg-slate-200" />
            <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
            <div className="mt-3 h-3 w-40 rounded bg-slate-100" />
          </div>
        ))}
      </section>

      {/* Test History List skeleton */}
      <section aria-label="Attempts loading" className="mt-10">
        <div className="mb-4 flex items-center justify-between animate-pulse">
          <div className="h-6 w-40 rounded bg-slate-200" />
          <div className="h-4 w-24 rounded bg-slate-100" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between animate-pulse"
              >
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-slate-200" />
                  <div className="h-3 w-32 rounded bg-slate-100" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-16 rounded-full bg-slate-200" />
                  <div className="h-8 w-20 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <span className="sr-only">Loading your dashboard…</span>
    </main>
  );
}

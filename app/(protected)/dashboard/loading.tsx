export default function DashboardLoading() {
  return (
    <main
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      aria-busy="true"
      aria-label="Loading student dashboard"
      role="status"
    >
      {/* Header skeleton */}
      <div className="ui-card flex animate-pulse flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-64 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-80 rounded bg-slate-100" />
        </div>
        <div className="h-11 w-full rounded-xl bg-slate-200 sm:w-36" />
      </div>

      {/* KPI Cards skeleton */}
      <section aria-label="Metrics loading" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="ui-card animate-pulse p-5 sm:p-6">
            <div className="h-3 w-28 rounded bg-slate-200" />
            <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
            <div className="mt-3 h-3 w-40 rounded bg-slate-100" />
          </div>
        ))}
      </section>

      <section aria-label="Analytics loading" className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,1fr)]">
        <div className="ui-card animate-pulse p-5 sm:p-6">
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="mt-5 h-56 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-50" />
        </div>
        <div className="ui-card flex animate-pulse flex-col items-center justify-center p-5 sm:p-6">
          <div className="h-5 w-40 self-start rounded bg-slate-200" />
          <div className="mt-5 size-40 rounded-full border-[18px] border-slate-200" />
        </div>
      </section>

      {/* Test History List skeleton */}
      <section aria-label="Attempts loading" className="mt-10">
        <div className="mb-4 flex items-center justify-between animate-pulse">
          <div className="h-6 w-40 rounded bg-slate-200" />
          <div className="h-4 w-24 rounded bg-slate-100" />
        </div>

        <div className="ui-card p-5 sm:p-6">
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

export default function AdminLoading() {
  return (
    <main
      className="mx-auto max-w-6xl px-6 py-12"
      aria-busy="true"
      aria-label="Loading administration portal"
      role="status"
    >
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between animate-pulse">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-24 rounded bg-purple-200" />
            <div className="h-5 w-20 rounded-full bg-purple-100" />
          </div>
          <div className="mt-3 h-8 w-64 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-96 rounded bg-slate-100" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-slate-200" />
      </div>

      {/* KPI Cards skeleton */}
      <section aria-label="KPI loading" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
            <div className="h-3 w-32 rounded bg-slate-200" />
            <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
            <div className="mt-3 h-3 w-44 rounded bg-slate-100" />
          </div>
        ))}
      </section>

      {/* User Directory Table skeleton */}
      <section aria-label="Table loading" className="mt-10">
        <div className="mb-4 flex items-center justify-between animate-pulse">
          <div className="h-6 w-36 rounded bg-slate-200" />
          <div className="h-4 w-28 rounded bg-slate-100" />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
          </div>
          <div className="divide-y divide-slate-100 p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between pt-3 first:pt-0 animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-slate-200" />
                  <div className="h-3 w-56 rounded bg-slate-100" />
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-200" />
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="h-8 w-44 rounded-lg bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <span className="sr-only">Loading administration tools…</span>
    </main>
  );
}

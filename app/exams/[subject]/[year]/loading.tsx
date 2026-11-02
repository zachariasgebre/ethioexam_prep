export default function ExamLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12" aria-busy="true" aria-label="Loading practice exam" role="status">
      <div className="ui-card animate-pulse p-5 sm:p-7">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="mt-5 h-9 w-72 max-w-full rounded bg-slate-200" />
        <div className="mt-3 h-5 w-80 max-w-full rounded bg-slate-100" />
      </div>
      <div className="mt-8 space-y-5" aria-hidden="true">
        {[1, 2, 3].map((item) => (
          <section key={item} className="ui-card animate-pulse p-5 sm:p-7">
            <div className="h-4 w-24 rounded bg-emerald-100" />
            <div className="mt-3 h-6 w-full rounded bg-slate-200" />
            <div className="mt-2 h-6 w-3/4 rounded bg-slate-200" />
            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map((option) => <div key={option} className="h-12 rounded-xl border border-slate-200 bg-slate-50" />)}
            </div>
          </section>
        ))}
      </div>
      <span className="sr-only">Loading all exam questions.</span>
    </main>
  );
}

export default function SubjectLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12" aria-busy="true" aria-label="Loading exam years" role="status">
      <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
      <div className="mt-5 h-9 w-64 max-w-full animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-slate-100" />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {[1, 2, 3].map((item) => <li key={item} className="h-36 animate-pulse rounded-2xl border bg-white" />)}
      </ul>
      <span className="sr-only">Loading available years.</span>
    </main>
  );
}

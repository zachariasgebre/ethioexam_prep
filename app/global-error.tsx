"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><main className="mx-auto max-w-xl px-6 py-24"><h1 className="text-3xl font-bold">Something went wrong</h1><p className="mt-3 text-slate-600">Please try again.</p><button className="mt-6 rounded-lg bg-emerald-700 px-4 py-2 text-white" onClick={() => reset()}>Try again</button></main></body></html>;
}

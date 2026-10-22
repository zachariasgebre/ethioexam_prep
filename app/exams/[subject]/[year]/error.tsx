"use client";

export default function ExamError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-3xl px-6 py-16"><h1 className="text-2xl font-bold">Could not load this exam</h1><button className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-white" onClick={() => reset()}>Try again</button></main>;
}

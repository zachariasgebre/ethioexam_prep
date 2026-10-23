"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ExamErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ExamError({ error, reset }: ExamErrorProps) {
  useEffect(() => {
    // Log unexpected exam errors to console / telemetry
    console.error("Exam load error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <div
        role="alert"
        aria-labelledby="error-heading"
        className="w-full rounded-2xl border border-rose-200 bg-rose-50/50 p-8 shadow-sm sm:p-10"
      >
        {/* Error Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 id="error-heading" className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
          Could not load this exam
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          We encountered an issue retrieving the questions for this national exam paper. This might be due to a
          temporary database connection issue or an invalid exam parameter.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs font-mono text-slate-400">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Try again
          </button>

          <Link
            href="/exams"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Browse all exams
          </Link>
        </div>
      </div>
    </main>
  );
}

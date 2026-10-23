"use client";

import { useState, useTransition } from "react";
import { deleteUserProgress } from "@/lib/actions/exams";

interface DeleteProgressButtonProps {
  progressId: string;
  examTitle: string;
}

export function DeleteProgressButton({ progressId, examTitle }: DeleteProgressButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!confirm(`Are you sure you want to delete your score record for ${examTitle}?`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await deleteUserProgress(progressId);
      if (res.error) {
        setError(res.error);
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 hover:border-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Delete progress record for ${examTitle}`}
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error && <span role="alert" className="mt-1 text-xs text-rose-600">{error}</span>}
    </div>
  );
}


"use client";

import { useState, useTransition } from "react";
import { deleteUserProgress } from "@/lib/actions/exams";

export function DeleteProgressButton({ progressId }: { progressId: string }) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError("");
    startTransition(async () => {
      try {
        const result = await deleteUserProgress(progressId);
        if (result.error) setError(result.error);
      } catch {
        setError("Unable to delete this result. Please try again.");
      }
    });
  }

  return <div>
    <button
      type="button"
      className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 disabled:opacity-50"
      onClick={handleDelete}
      disabled={pending}
    >{pending ? "Deleting…" : "Delete history"}</button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>;
}

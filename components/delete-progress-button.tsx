"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { deleteUserProgress } from "@/lib/actions/exams";

export function DeleteProgressButton({ progressId, queryKey }: { progressId: string; queryKey: QueryKey }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const result = await deleteUserProgress(progressId);
      if ("error" in result) throw new Error(result.error);
      return result;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return <div>
    <button
      type="button"
      className="ui-button min-h-10 border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:border-rose-300 hover:bg-rose-50"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >{mutation.isPending ? "Deleting…" : "Delete history"}</button>
    {mutation.isError && <p role="alert" className="mt-2 text-sm text-red-700">Unable to delete this result. Please try again.</p>}
  </div>;
}

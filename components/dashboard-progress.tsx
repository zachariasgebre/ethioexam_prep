"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProgress } from "@/lib/actions/exams";
import { DeleteProgressButton } from "@/components/delete-progress-button";
import { dashboardProgressQueryKey } from "@/lib/query-keys";

type Attempt = Awaited<ReturnType<typeof getUserProgress>>[number];

function ScoreChart({ attempts }: { attempts: Attempt[] }) {
  const recentAttempts = [...attempts].reverse().slice(-8);

  if (recentAttempts.length === 0) {
    return <p className="mt-4 text-sm text-slate-600">Complete a quiz to see your score trend here.</p>;
  }

  return (
    <div className="mt-6">
      <div
        className="flex h-52 items-end gap-3 border-b border-l border-slate-300 px-2"
        role="img"
        aria-label={`Quiz score chart for ${recentAttempts.length} recent attempts. ${recentAttempts.map((attempt) => `${attempt.subject} ${attempt.year}: ${Math.round((attempt.score / attempt.totalQuestions) * 100)} percent`).join("; ")}.`}
      >
        {recentAttempts.map((attempt) => {
          const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
          return (
            <div key={attempt.id} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2" title={`${attempt.subject} ${attempt.year}: ${percentage}%`}>
              <span aria-hidden="true" className="text-xs font-medium text-slate-600">{percentage}%</span>
              <div
                aria-hidden="true"
                className="w-full max-w-14 rounded-t-md bg-emerald-700"
                style={{ height: `${Math.max(percentage, 2)}%` }}
              />
              <span aria-hidden="true" className="w-full truncate text-center text-[10px] text-slate-500">{attempt.subject}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">Most recent {recentAttempts.length} quiz scores, oldest to newest</p>
    </div>
  );
}

function AnswerDistributionChart({ attempts }: { attempts: Attempt[] }) {
  const correctAnswers = attempts.reduce((total, attempt) => total + attempt.score, 0);
  const totalAnswers = attempts.reduce((total, attempt) => total + attempt.totalQuestions, 0);
  const incorrectAnswers = totalAnswers - correctAnswers;

  if (totalAnswers === 0) {
    return <p className="mt-4 text-sm text-slate-600">Complete a quiz to see your answer distribution.</p>;
  }

  const correctPercentage = Math.round((correctAnswers / totalAnswers) * 100);
  const incorrectPercentage = 100 - correctPercentage;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-6">
      <div
        className="size-40 shrink-0 rounded-full"
        role="img"
        aria-label={`Answer distribution: ${correctAnswers} correct answers (${correctPercentage} percent), ${incorrectAnswers} incorrect answers (${incorrectPercentage} percent).`}
        style={{
          background: `conic-gradient(#047857 0 ${correctPercentage}%, #fda4af ${correctPercentage}% 100%)`,
        }}
      />
      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="size-3 rounded-full bg-emerald-700" />
          <span>Correct: {correctAnswers} ({correctPercentage}%)</span>
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="size-3 rounded-full bg-rose-300" />
          <span>Incorrect: {incorrectAnswers} ({incorrectPercentage}%)</span>
        </li>
        <li className="text-slate-500">Based on {totalAnswers} answered questions</li>
      </ul>
    </div>
  );
}

export function DashboardProgress({ userName, userId, hasPaid }: { userName: string; userId: string; hasPaid: boolean }) {
  const { data: attempts, isPending, isError, refetch } = useQuery({
    queryKey: [...dashboardProgressQueryKey, userId],
    queryFn: getUserProgress,
  });

  const totalScore = attempts?.reduce((total, attempt) => total + attempt.score, 0) ?? 0;
  const totalQuestions = attempts?.reduce((total, attempt) => total + attempt.totalQuestions, 0) ?? 0;
  const averagePerformance = totalQuestions === 0 ? 0 : Math.round((totalScore / totalQuestions) * 100);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Your progress">
        <article className="rounded-xl border bg-white p-5"><h2 className="text-sm text-slate-600">Average performance</h2><p className="mt-2 text-2xl font-bold">{isPending ? "…" : `${averagePerformance}%`}</p></article>
        <article className="rounded-xl border bg-white p-5"><h2 className="text-sm text-slate-600">Quizzes completed</h2><p className="mt-2 text-2xl font-bold">{isPending ? "…" : attempts?.length ?? 0}</p></article>
        <article className="rounded-xl border bg-white p-5"><h2 className="text-sm text-slate-600">Subscription</h2><p className="mt-2 text-2xl font-bold">{hasPaid ? "Premium" : "Free"}</p></article>
      </section>

      <section className="mt-8 rounded-xl border bg-white p-6" aria-labelledby="score-trend-heading">
        <h2 id="score-trend-heading" className="text-xl font-semibold">Score trend</h2>
        {isPending ? (
          <p className="mt-4 text-sm text-slate-600" role="status">Loading your score history…</p>
        ) : isError ? (
          <div className="mt-4">
            <p className="text-sm text-red-700" role="alert">Unable to load your progress. Please try again.</p>
            <button type="button" className="mt-3 rounded-lg border px-3 py-2 text-sm" onClick={() => void refetch()}>Try again</button>
          </div>
        ) : (
          <ScoreChart attempts={attempts ?? []} />
        )}
      </section>

      <section className="mt-6 rounded-xl border bg-white p-6" aria-labelledby="answer-distribution-heading">
        <h2 id="answer-distribution-heading" className="text-xl font-semibold">Answer distribution</h2>
        {isPending ? (
          <p className="mt-4 text-sm text-slate-600" role="status">Loading your answer statistics…</p>
        ) : isError ? (
          <p className="mt-4 text-sm text-red-700" role="alert">Answer statistics are unavailable until your progress can be loaded.</p>
        ) : (
          <AnswerDistributionChart attempts={attempts ?? []} />
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Completed tests</h2>
        {isPending ? <p className="mt-4 text-slate-600" role="status">Loading your completed quizzes…</p> : isError ? (
          <p className="mt-4 text-sm text-red-700" role="alert">Your quiz history is unavailable until progress can be loaded.</p>
        ) : attempts?.length === 0 ? <p className="mt-4 text-slate-600">You have not completed any quizzes yet.</p> : (
          <ul className="mt-4 space-y-3">
            {attempts?.map((attempt) => (
              <li key={attempt.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-5">
                <div>
                  <h3 className="font-semibold">{attempt.subject} · {attempt.year}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {attempt.score}/{attempt.totalQuestions} correct ({Math.round((attempt.score / attempt.totalQuestions) * 100)}%) · {new Date(attempt.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <DeleteProgressButton progressId={attempt.id} queryKey={[...dashboardProgressQueryKey, userId]} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

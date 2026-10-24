"use client";

import Link from "next/link";
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

export function DashboardProgress({
  userName,
  userId,
  hasPaid,
  isAdmin = false,
}: {
  userName: string;
  userId: string;
  hasPaid: boolean;
  isAdmin?: boolean;
}) {
  const { data: attempts, isPending, isError, refetch } = useQuery({
    queryKey: [...dashboardProgressQueryKey, userId],
    queryFn: getUserProgress,
  });

  const totalScore = attempts?.reduce((total, attempt) => total + attempt.score, 0) ?? 0;
  const totalQuestions = attempts?.reduce((total, attempt) => total + attempt.totalQuestions, 0) ?? 0;
  const averagePerformance = totalQuestions === 0 ? 0 : Math.round((totalScore / totalQuestions) * 100);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Student Portal</span>
            {isAdmin && (
              <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                Admin Account
              </span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome, {userName}</h1>
          <p className="mt-1 text-sm text-slate-600">Track your national examination preparation milestones and accuracy.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800"
            >
              Admin Portal →
            </Link>
          )}
          <Link
            href="/exams"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Practice Exams
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Your progress">
        <article className="rounded-xl border bg-white p-5">
          <h2 className="text-sm text-slate-600">Average performance</h2>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{isPending ? "…" : `${averagePerformance}%`}</p>
        </article>
        <article className="rounded-xl border bg-white p-5">
          <h2 className="text-sm text-slate-600">Quizzes completed</h2>
          <p className="mt-2 text-2xl font-bold text-slate-900">{isPending ? "…" : attempts?.length ?? 0}</p>
        </article>
        <article className="rounded-xl border bg-white p-5">
          <h2 className="text-sm text-slate-600">Subscription</h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-900">{hasPaid ? "Premium" : "Free"}</span>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${hasPaid ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
              {hasPaid ? "Full Access" : "Standard"}
            </span>
          </div>
        </article>
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Completed tests</h2>
          {attempts && attempts.length > 0 && (
            <span className="text-xs font-medium text-slate-500">{attempts.length} record{attempts.length === 1 ? "" : "s"}</span>
          )}
        </div>

        {isPending ? (
          <p className="mt-4 text-slate-600" role="status">Loading your completed quizzes…</p>
        ) : isError ? (
          <p className="mt-4 text-sm text-red-700" role="alert">Your quiz history is unavailable until progress can be loaded.</p>
        ) : attempts?.length === 0 ? (
          /* Day 3 Empty state card for brand-new student accounts with zero test history */
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">No exam attempts yet</h3>
            <p className="mt-2 max-w-md text-sm text-slate-600 leading-relaxed">
              You haven&apos;t completed any practice exams yet. Choose a national exam paper from our collection to begin practicing, test your knowledge against official keys, and see your progress analytics here.
            </p>
            <div className="mt-6">
              <Link
                href="/exams"
                className="inline-flex items-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Browse available exams →
              </Link>
            </div>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {attempts?.map((attempt) => (
              <li key={attempt.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-5">
                <div>
                  <h3 className="font-semibold text-slate-900">{attempt.subject} · {attempt.year}</h3>
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

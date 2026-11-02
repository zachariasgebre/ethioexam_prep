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
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-9 text-center">
        <p className="font-semibold text-slate-800">Your score trend will appear here</p>
        <p className="mt-1 text-sm text-slate-500">Complete a practice exam to start tracking your progress.</p>
      </div>
    );
  }

  const columns = { gridTemplateColumns: `repeat(${recentAttempts.length}, minmax(0, 1fr))` };
  const chartDescription = recentAttempts.map((attempt) => {
    const score = Math.round((attempt.score / attempt.totalQuestions) * 100);
    return `${new Date(attempt.completedAt).toLocaleDateString("en-US")}, ${attempt.subject} ${attempt.year}: ${score} percent`;
  }).join("; ");

  return (
    <div className="mt-5">
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[35rem] sm:min-w-0">
          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
            <div aria-hidden="true" className="flex h-52 flex-col justify-between pb-0.5 pt-0 text-right text-[10px] font-medium text-slate-400">
              <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
            </div>
            <div
              role="img"
              aria-label={`Score trend for ${recentAttempts.length} recent exams. ${chartDescription}`}
              className="relative h-52 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80"
            >
              <div aria-hidden="true" className="absolute inset-x-0 inset-y-2 flex flex-col justify-between px-3">
                {[0, 1, 2, 3, 4].map((line) => <span key={line} className="border-t border-dashed border-slate-200" />)}
              </div>
              <div className="relative z-10 grid h-full gap-2 px-2" style={columns}>
                {recentAttempts.map((attempt) => {
                  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                  const labelStyle = percentage >= 92
                    ? { top: "0.35rem" }
                    : { bottom: `calc(${Math.max(percentage, 7)}% + 0.35rem)` };
                  return (
                    <div key={attempt.id} className="relative h-full min-w-0" title={`${attempt.subject} ${attempt.year}: ${percentage}%`}>
                      <span
                        aria-hidden="true"
                        style={labelStyle}
                        className={`absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow-sm ${percentage >= 92 ? "bg-emerald-800 text-white" : "bg-white/95 text-slate-600"}`}
                      >
                        {percentage}%
                      </span>
                      <div
                        aria-hidden="true"
                        className="absolute bottom-0 left-1/2 w-[min(2.4rem,72%)] -translate-x-1/2 rounded-t-lg bg-gradient-to-t from-emerald-800 to-emerald-500 shadow-[0_3px_10px_-5px_rgba(5,150,105,0.8)]"
                        style={{ height: `${Math.max(percentage, 2)}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-2 pl-[3.25rem]" style={columns}>
            {recentAttempts.map((attempt) => {
              const dateLabel = new Date(attempt.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return (
                <div key={attempt.id} className="min-w-0 text-center" title={`${attempt.subject} ${attempt.year}, ${dateLabel}`}>
                  <p className="truncate text-[11px] font-semibold text-slate-700">{attempt.subject}</p>
                  <p className="truncate text-[10px] text-slate-500">{attempt.year}</p>
                  <p className="truncate text-[10px] text-slate-400">{dateLabel}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">Most recent {recentAttempts.length} exam scores, from oldest to newest</p>
    </div>
  );
}

function AnswerDistributionChart({ attempts }: { attempts: Attempt[] }) {
  const correctAnswers = attempts.reduce((total, attempt) => total + attempt.score, 0);
  const totalAnswers = attempts.reduce((total, attempt) => total + attempt.totalQuestions, 0);
  const incorrectAnswers = totalAnswers - correctAnswers;

  if (totalAnswers === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-9 text-center">
        <p className="font-semibold text-slate-800">No answers to summarize yet</p>
        <p className="mt-1 text-sm text-slate-500">Your correct and incorrect totals appear after your first exam.</p>
      </div>
    );
  }

  const correctPercentage = Math.round((correctAnswers / totalAnswers) * 100);
  const incorrectPercentage = 100 - correctPercentage;

  return (
    <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center lg:flex-col xl:flex-row">
      <div
        role="img"
        aria-label={`Answer distribution: ${correctAnswers} correct answers (${correctPercentage} percent), ${incorrectAnswers} incorrect answers (${incorrectPercentage} percent).`}
        className="relative size-44 shrink-0 rounded-full p-3 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)]"
        style={{ background: `conic-gradient(from -90deg, #059669 0 ${correctPercentage}%, #fecdd3 ${correctPercentage}% 100%)` }}
      >
        <div aria-hidden="true" className="flex size-full flex-col items-center justify-center rounded-full border border-slate-100 bg-white shadow-inner">
          <span className="text-3xl font-bold tracking-tight text-slate-900">{correctPercentage}%</span>
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Correct</span>
        </div>
      </div>
      <ul className="w-full max-w-xs space-y-3">
        <li className="flex items-center justify-between gap-4 rounded-xl bg-emerald-50/80 px-3.5 py-3">
          <span className="flex items-center gap-2.5 text-sm font-medium text-slate-700"><span aria-hidden="true" className="size-2.5 rounded-full bg-emerald-600" />Correct</span>
          <span className="text-sm font-bold text-emerald-800">{correctAnswers} <span className="font-medium text-emerald-700">({correctPercentage}%)</span></span>
        </li>
        <li className="flex items-center justify-between gap-4 rounded-xl bg-rose-50/80 px-3.5 py-3">
          <span className="flex items-center gap-2.5 text-sm font-medium text-slate-700"><span aria-hidden="true" className="size-2.5 rounded-full bg-rose-300" />Incorrect</span>
          <span className="text-sm font-bold text-rose-800">{incorrectAnswers} <span className="font-medium text-rose-700">({incorrectPercentage}%)</span></span>
        </li>
        <li className="px-1 text-xs leading-5 text-slate-500">Across {totalAnswers} answered questions from {attempts.length} completed {attempts.length === 1 ? "exam" : "exams"}.</li>
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
  const accessLabel = isAdmin ? "Admin access" : hasPaid ? "Premium access" : "Free access";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="flex flex-col justify-between gap-5 rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:p-7">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Student portal</span>
            {isAdmin && <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-800">Admin account</span>}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Welcome, {userName}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">A clear view of your exam practice, accuracy, and progress over time.</p>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:w-auto sm:min-w-64">
          {isAdmin && <Link href="/admin" className="ui-button ui-button-secondary w-full border-purple-200 text-purple-800 hover:border-purple-300 hover:bg-purple-50">Admin portal <span aria-hidden="true">→</span></Link>}
          <Link href="/exams" className={`ui-button ui-button-primary w-full ${isAdmin ? "" : "min-[420px]:col-span-2"}`}>Practice exams <span aria-hidden="true">→</span></Link>
        </div>
      </header>

      <section className="mt-5 grid gap-4 sm:grid-cols-3" aria-label="Your progress">
        <article className="ui-card relative overflow-hidden p-5 sm:p-6">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-300" />
          <p className="text-sm font-medium text-slate-500">Average performance</p>
          {isPending ? <div className="mt-3 h-9 w-24 animate-pulse rounded-lg bg-slate-100" /> : <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{averagePerformance}<span className="ml-0.5 text-xl text-emerald-700">%</span></p>}
          <p className="mt-2 text-xs text-slate-500">Across all completed questions</p>
        </article>
        <article className="ui-card relative overflow-hidden p-5 sm:p-6">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-600 to-cyan-300" />
          <p className="text-sm font-medium text-slate-500">Exams completed</p>
          {isPending ? <div className="mt-3 h-9 w-16 animate-pulse rounded-lg bg-slate-100" /> : <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{attempts?.length ?? 0}</p>}
          <p className="mt-2 text-xs text-slate-500">Saved in your practice history</p>
        </article>
        <article className="ui-card relative overflow-hidden p-5 sm:p-6">
          <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${isAdmin ? "bg-gradient-to-r from-purple-600 to-violet-300" : hasPaid ? "bg-gradient-to-r from-emerald-600 to-teal-300" : "bg-gradient-to-r from-slate-400 to-slate-200"}`} />
          <p className="text-sm font-medium text-slate-500">Account access</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{accessLabel}</p>
          <p className="mt-2 text-xs text-slate-500">Your current exam access level</p>
        </article>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,1fr)]">
        <article className="ui-card min-w-0 p-5 sm:p-6" aria-labelledby="score-trend-heading">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Performance</p>
              <h2 id="score-trend-heading" className="mt-1 text-xl font-bold tracking-tight text-slate-950">Score trend</h2>
              <p className="mt-1 text-sm text-slate-500">Your percentage score on recent exams</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Latest 8</span>
          </div>
          {isPending ? (
            <div className="mt-5 h-64 animate-pulse rounded-2xl bg-gradient-to-b from-slate-100 to-slate-50" role="status"><span className="sr-only">Loading your score history…</span></div>
          ) : isError ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5" role="alert">
              <p className="text-sm font-semibold text-rose-900">We couldn’t load your score history.</p>
              <button type="button" className="ui-button ui-button-secondary mt-3 min-h-10 border-rose-200 text-rose-800 hover:bg-white" onClick={() => void refetch()}>Try again</button>
            </div>
          ) : <ScoreChart attempts={attempts ?? []} />}
        </article>

        <article className="ui-card min-w-0 p-5 sm:p-6" aria-labelledby="answer-distribution-heading">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Accuracy</p>
            <h2 id="answer-distribution-heading" className="mt-1 text-xl font-bold tracking-tight text-slate-950">Answer distribution</h2>
            <p className="mt-1 text-sm text-slate-500">Correct and incorrect answers combined</p>
          </div>
          {isPending ? (
            <div className="mt-5 flex h-56 animate-pulse items-center justify-center rounded-2xl bg-slate-50" role="status"><div className="size-40 rounded-full border-[18px] border-slate-200" /><span className="sr-only">Loading your answer statistics…</span></div>
          ) : isError ? (
            <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800" role="alert">Answer statistics are unavailable until progress loads.</p>
          ) : <AnswerDistributionChart attempts={attempts ?? []} />}
        </article>
      </section>

      <section className="mt-8" aria-labelledby="completed-tests-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Your activity</p>
            <h2 id="completed-tests-heading" className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Completed exams</h2>
          </div>
          {attempts && attempts.length > 0 && <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">{attempts.length} {attempts.length === 1 ? "record" : "records"}</span>}
        </div>

        {isPending ? (
          <div className="ui-card space-y-3 p-5" role="status" aria-busy="true">
            {[1, 2, 3].map((item) => <div key={item} className="flex animate-pulse items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0"><div className="space-y-2"><div className="h-4 w-40 rounded bg-slate-200" /><div className="h-3 w-28 rounded bg-slate-100" /></div><div className="h-8 w-20 rounded-lg bg-slate-100" /></div>)}
            <span className="sr-only">Loading your completed exams…</span>
          </div>
        ) : isError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800" role="alert">Your exam history is unavailable until progress can be loaded.</p>
        ) : attempts?.length === 0 ? (
          <div className="ui-card flex flex-col items-center px-6 py-12 text-center sm:py-14">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700" aria-hidden="true">
              <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-950">Your first exam is waiting</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">Choose a past paper, practice at your own pace, and your result will appear here.</p>
            <Link href="/exams" className="ui-button ui-button-primary mt-6">Browse exams <span aria-hidden="true">→</span></Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {attempts?.map((attempt) => {
              const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
              return (
                <li key={attempt.id} className="ui-card flex flex-col gap-4 p-4 transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <div aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M12 3.75 5.25 6v5.38c0 4.05 2.78 7.82 6.75 8.87 3.97-1.05 6.75-4.82 6.75-8.87V6L12 3.75Z" /></svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">{attempt.subject} <span className="text-slate-400">·</span> {attempt.year}</h3>
                      <p className="mt-1 text-sm text-slate-500">{attempt.score} of {attempt.totalQuestions} correct <span className="px-1 text-slate-300">·</span> {new Date(attempt.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                    <span className={`rounded-full px-3 py-1 text-sm font-bold ${percentage >= 70 ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{percentage}%</span>
                    <DeleteProgressButton progressId={attempt.id} queryKey={[...dashboardProgressQueryKey, userId]} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

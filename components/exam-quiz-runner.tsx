"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitExamAttempt } from "@/lib/actions/exams";

interface QuestionItem {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string | null;
}

interface ExamQuizRunnerProps {
  exam: {
    id: string;
    subject: string;
    year: string;
    totalQuestions: number;
  };
  questions: QuestionItem[];
}

export function ExamQuizRunner({ exam, questions }: ExamQuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;

  function selectOption(optionIndex: number) {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function handleSubmit() {
    if (answeredCount < total) {
      const confirmSubmit = confirm(
        `You have answered ${answeredCount} of ${total} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    // Calculate score
    let calculatedScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOptionIndex) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setErrorMessage(null);

    startTransition(async () => {
      const res = await submitExamAttempt(exam.id, calculatedScore, exam.totalQuestions);
      if (res.error) {
        setErrorMessage(res.error);
      }
      setIsSubmitted(true);
    });
  }

  if (isSubmitted) {
    const percentage = Math.round((score / total) * 100);
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Score Header */}
        <div className="text-center">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold ${
              percentage >= 70
                ? "bg-emerald-100 text-emerald-800"
                : percentage >= 50
                ? "bg-amber-100 text-amber-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {percentage}%
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
            {percentage >= 70
              ? "Excellent Performance!"
              : percentage >= 50
              ? "Good Effort — Keep Practicing!"
              : "Review & Try Again"}
          </h2>
          <p className="mt-2 text-slate-600">
            You scored <span className="font-bold text-slate-900">{score}</span> out of{" "}
            <span className="font-bold text-slate-900">{total}</span> questions on{" "}
            <span className="font-medium text-emerald-800">{exam.subject} ({exam.year})</span>.
          </p>

          {errorMessage && (
            <p role="alert" className="mt-3 text-sm font-medium text-rose-600">
              Note: Could not automatically save score ({errorMessage}).
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              Go to Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setIsSubmitted(false);
                setCurrentIndex(0);
                setScore(0);
              }}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Retake Exam
            </button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="mt-10 border-t border-slate-200 pt-8">
          <h3 className="text-lg font-bold text-slate-900">Detailed Question Review</h3>
          <div className="mt-6 space-y-6">
            {questions.map((q, idx) => {
              const selected = answers[idx];
              const isCorrect = selected === q.correctOptionIndex;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-5 ${
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50/30"
                      : "border-rose-200 bg-rose-50/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-semibold text-slate-900">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
                        Q{idx + 1}.
                      </span>
                      {q.prompt}
                    </p>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      const isOptionCorrect = optIdx === q.correctOptionIndex;
                      let optionStyle = "border-slate-200 bg-white text-slate-700";
                      if (isOptionCorrect) {
                        optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-medium";
                      } else if (isOptionSelected && !isOptionCorrect) {
                        optionStyle = "border-rose-500 bg-rose-50 text-rose-900";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-xs ${optionStyle}`}
                        >
                          <span className="font-bold">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{opt}</span>
                          {isOptionCorrect && (
                            <span className="ml-auto text-emerald-700 font-bold">✓</span>
                          )}
                          {isOptionSelected && !isOptionCorrect && (
                            <span className="ml-auto text-rose-700 font-bold">✗</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-3 rounded-lg bg-white/80 p-3 text-xs text-slate-600 border border-slate-100">
                      <span className="font-bold text-slate-800">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Progress & Navigator */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            Question {currentIndex + 1} of {total}
          </span>
          <span>{answeredCount} of {total} answered</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Counter Pill Grid */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {questions.map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[idx] !== undefined;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-7 w-7 rounded-md text-xs font-medium transition ${
                isCurrent
                  ? "bg-emerald-700 text-white font-bold ring-2 ring-emerald-600 ring-offset-1"
                  : isAnswered
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              aria-label={`Jump to question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 leading-snug">
            {currentQuestion.prompt}
          </h2>

          {/* Options */}
          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = answers[currentIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => selectOption(optIdx)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left text-sm transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/60 text-emerald-950 font-medium shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isSelected
                        ? "bg-emerald-700 text-white"
                        : "border border-slate-300 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation & Submission Controls */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>

        {currentIndex === total - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {isPending ? "Submitting…" : "Submit Exam"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}


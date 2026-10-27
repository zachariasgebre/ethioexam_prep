"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { revealExamAnswer, submitExamAttempt } from "@/lib/actions/exams";
import { dashboardProgressQueryKey } from "@/lib/query-keys";

type QuizQuestion = { id: string; prompt: string; options: string[] };
type AnswerFeedback = {
  correctOptionIndex: number;
  explanation: string | null;
};

export function ExamQuizRunner({ examId, questions }: { examId: string; questions: QuizQuestion[] }) {
  const queryClient = useQueryClient();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, AnswerFeedback>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [checking, setChecking] = useState<Record<string, boolean>>({});
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const answeredCount = Object.keys(selectedOptions).length;
  const complete = score !== null;

  async function loadFeedback(question: QuizQuestion, selectedOptionIndex?: number) {
    setQuestionErrors((current) => ({ ...current, [question.id]: "" }));
    setChecking((current) => ({ ...current, [question.id]: true }));
    try {
      const result = await revealExamAnswer(examId, question.id, selectedOptionIndex);
      if ("error" in result) {
        setQuestionErrors((current) => ({ ...current, [question.id]: result.error ?? "This question is unavailable." }));
        return;
      }
      setFeedback((current) => ({ ...current, [question.id]: result }));
      setExpanded((current) => ({ ...current, [question.id]: true }));
    } catch {
      setQuestionErrors((current) => ({ ...current, [question.id]: "We could not load the explanation. Please try again." }));
    } finally {
      setChecking((current) => ({ ...current, [question.id]: false }));
    }
  }

  function selectOption(question: QuizQuestion, optionIndex: number) {
    setSelectedOptions((current) => ({ ...current, [question.id]: optionIndex }));
    setExpanded((current) => ({ ...current, [question.id]: true }));
    if (!feedback[question.id]) {
      void loadFeedback(question, optionIndex);
    }
  }

  async function submitExam() {
    setSubmitError("");
    setSubmitting(true);
    try {
      const result = await submitExamAttempt(examId, questions.map(({ id }) => ({
        questionId: id,
        selectedOptionIndex: selectedOptions[id] ?? -1,
      })));
      if ("error" in result) {
        setSubmitError(result.error ?? "Unable to submit this quiz.");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: dashboardProgressQueryKey });
      setScore(result.score);
    } catch {
      setSubmitError("Sign in to save your result, then try submitting again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <section className="sticky top-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur" aria-label="Exam progress">
        <p className="text-sm font-medium text-slate-700">{answeredCount} of {questions.length} answered</p>
        {complete ? (
          <p className="text-sm font-semibold text-emerald-800" role="status">
            Score saved: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
        ) : (
          <button
            type="button"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={submitExam}
            disabled={submitting || answeredCount !== questions.length}
          >
            {submitting ? "Saving score…" : "Submit exam"}
          </button>
        )}
      </section>

      {submitError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{submitError}</p>}

      <ol className="space-y-5">
        {questions.map((question, questionIndex) => {
          const answerFeedback = feedback[question.id];
          const isExpanded = expanded[question.id] ?? false;
          const selectedOption = selectedOptions[question.id];
          const selectedOptionIsCorrect = selectedOption === undefined
            ? null
            : selectedOption === answerFeedback?.correctOptionIndex;
          const explanationId = `explanation-${question.id}`;

          return (
            <li key={question.id}>
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Question {questionIndex + 1}</p>
                <h2 className="mt-2 text-lg font-semibold leading-7 text-slate-900 sm:text-xl">{question.prompt}</h2>

                <fieldset className="mt-5 space-y-3" disabled={complete || submitting || checking[question.id]}>
                  <legend className="sr-only">Choose an answer for question {questionIndex + 1}</legend>
                  {question.options.map((option, optionIndex) => {
                    const isCorrectAnswer = answerFeedback?.correctOptionIndex === optionIndex;
                    const isSelected = selectedOption === optionIndex;
                    const optionStyle = answerFeedback && isCorrectAnswer
                      ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                      : answerFeedback && isSelected
                        ? "border-rose-300 bg-rose-50 text-rose-950"
                        : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40";

                    return (
                      <label key={`${question.id}-${optionIndex}`} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition sm:p-4 ${optionStyle}`}>
                        <input
                          className="mt-1 size-4 shrink-0 accent-emerald-700"
                          type="radio"
                          name={`question-${question.id}`}
                          checked={isSelected}
                          onChange={() => selectOption(question, optionIndex)}
                        />
                        <span className="flex min-w-0 gap-2 text-sm leading-6 sm:text-base">
                          <span className="font-semibold">{String.fromCharCode(65 + optionIndex)}.</span>
                          <span>{option}</span>
                        </span>
                        {answerFeedback && isCorrectAnswer && <span className="ml-auto shrink-0 text-xs font-semibold text-emerald-800">Correct answer</span>}
                      </label>
                    );
                  })}
                </fieldset>

                {questionErrors[question.id] && <p role="alert" className="mt-3 text-sm text-red-700">{questionErrors[question.id]}</p>}

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                    aria-expanded={isExpanded}
                    aria-controls={explanationId}
                    disabled={checking[question.id]}
                    onClick={() => {
                      if (answerFeedback) setExpanded((current) => ({ ...current, [question.id]: !isExpanded }));
                      else void loadFeedback(question, selectedOption);
                    }}
                  >
                    {checking[question.id] ? "Loading explanation…" : isExpanded ? "Hide answer and explanation" : "Show answer and explanation"}
                  </button>

                  <div id={explanationId} hidden={!isExpanded || !answerFeedback} className="answer-reveal mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4" aria-live="polite">
                    {answerFeedback && (
                      <>
                        {selectedOptionIsCorrect === true ? (
                          <p className="font-semibold text-emerald-900">Correct! You chose the right answer.</p>
                        ) : selectedOptionIsCorrect === false ? (
                          <p className="font-semibold text-rose-800">Not quite. The correct answer is {String.fromCharCode(65 + answerFeedback.correctOptionIndex)}.</p>
                        ) : (
                          <p className="font-semibold text-emerald-900">Correct answer: {String.fromCharCode(65 + answerFeedback.correctOptionIndex)}.</p>
                        )}
                        {answerFeedback.explanation && <p className="mt-2 text-sm leading-6 text-slate-700">{answerFeedback.explanation}</p>}
                      </>
                    )}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      {!complete && (
        <div className="flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Answer every question to save your score.</p>
          <button
            type="button"
            className="min-h-11 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={submitExam}
            disabled={submitting || answeredCount !== questions.length}
          >
            {submitting ? "Saving score…" : "Submit exam"}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { submitExamAttempt } from "@/lib/actions/exams";

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

export function ExamQuizRunner({ examId, questions }: { examId: string; questions: QuizQuestion[] }) {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const question = questions[activeQuestion];
  const complete = score !== null;

  async function handleSubmit() {
    setError("");
    setPending(true);
    try {
      const result = await submitExamAttempt(examId, questions.map(({ id }) => ({
        questionId: id,
        selectedOptionIndex: selectedOptions[id] ?? -1,
      })));
      if ("error" in result) {
        setError(result.error ?? "Unable to submit this quiz.");
        return;
      }
      setScore(result.score);
    } catch {
      setError("We could not save your result. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (complete) {
    return <section className="mt-8 rounded-xl border bg-white p-6" aria-live="polite">
      <h2 className="text-2xl font-semibold">Quiz complete</h2>
      <p className="mt-3">Your score: <strong>{score}/{questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)</p>
      <p className="mt-2 text-sm text-slate-600">Your result has been saved to your dashboard.</p>
    </section>;
  }

  return <section className="mt-8 rounded-xl border bg-white p-6">
    <div className="flex justify-between text-sm text-slate-600">
      <span>Question {activeQuestion + 1} of {questions.length}</span>
      <span>{Object.keys(selectedOptions).length} answered</span>
    </div>
    <h2 className="mt-5 text-xl font-semibold">{question.prompt}</h2>
    <fieldset className="mt-5 space-y-3">
      <legend className="sr-only">Answer options</legend>
      {question.options.map((option, index) => (
        <label key={index} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-slate-50">
          <input
            type="radio"
            name={`question-${question.id}`}
            checked={selectedOptions[question.id] === index}
            onChange={() => setSelectedOptions((current) => ({ ...current, [question.id]: index }))}
          />
          <span>{option}</span>
        </label>
      ))}
    </fieldset>
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    <div className="mt-6 flex flex-wrap justify-between gap-3">
      <button
        type="button"
        className="rounded-lg border px-4 py-2 disabled:opacity-50"
        onClick={() => setActiveQuestion((current) => current - 1)}
        disabled={activeQuestion === 0 || pending}
      >Previous</button>
      {activeQuestion < questions.length - 1 ? (
        <button
          type="button"
          className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
          onClick={() => setActiveQuestion((current) => current + 1)}
          disabled={pending}
        >Next</button>
      ) : (
        <button
          type="button"
          className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
          onClick={handleSubmit}
          disabled={pending || Object.keys(selectedOptions).length !== questions.length}
        >{pending ? "Submitting…" : "Submit quiz"}</button>
      )}
    </div>
  </section>;
}

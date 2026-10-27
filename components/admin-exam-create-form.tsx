"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createExam } from "@/lib/actions/admin";

type DraftQuestion = {
  key: string;
  prompt: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
};

function emptyQuestion(key: string): DraftQuestion {
  return { key, prompt: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" };
}

const subjects = ["Biology", "Chemistry", "English", "Mathematics", "Physics", "SAT"];
const optionLetters = ["A", "B", "C", "D"] as const;

export function AdminExamCreateForm() {
  const router = useRouter();
  const questionNumber = useRef(1);
  const [subjectChoice, setSubjectChoice] = useState("Mathematics");
  const [customSubject, setCustomSubject] = useState("");
  const [year, setYear] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [questions, setQuestions] = useState<DraftQuestion[]>([emptyQuestion("question-1")]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [createdExam, setCreatedExam] = useState<{ subject: string; year: string } | null>(null);

  function updateQuestion(key: string, update: Partial<DraftQuestion>) {
    setQuestions((current) => current.map((question) => question.key === key ? { ...question, ...update } : question));
  }

  function updateOption(key: string, optionIndex: number, value: string) {
    setQuestions((current) => current.map((question) => {
      if (question.key !== key) return question;
      const options = [...question.options] as DraftQuestion["options"];
      options[optionIndex] = value;
      return { ...question, options };
    }));
  }

  function addQuestion() {
    questionNumber.current += 1;
    setQuestions((current) => [...current, emptyQuestion(`question-${questionNumber.current}`)]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const subject = subjectChoice === "Other" ? customSubject.trim() : subjectChoice;

    try {
      const result = await createExam({
        subject,
        year,
        isPremium,
        questions: questions.map(({ prompt, options, correctOptionIndex, explanation }) => ({
          prompt,
          options,
          correctOptionIndex,
          explanation,
        })),
      });

      if ("error" in result) {
        setError(result.error ?? "Unable to create the exam.");
        return;
      }

      setCreatedExam({ subject, year: year.trim() });
      router.refresh();
    } catch {
      setError("Unable to create the exam. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      {createdExam && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="status">
          <p className="font-semibold">Exam created successfully.</p>
          <Link className="mt-2 inline-block font-medium underline" href={`/exams/${encodeURIComponent(createdExam.subject)}/${encodeURIComponent(createdExam.year)}`}>
            View {createdExam.subject} {createdExam.year}
          </Link>
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6" aria-labelledby="exam-details-heading">
          <div className="sm:col-span-2">
            <h2 id="exam-details-heading" className="text-lg font-bold text-slate-900">Exam details</h2>
            <p className="mt-1 text-sm text-slate-600">Set the subject, year, and access level for the new paper.</p>
          </div>

          <label className="block text-sm font-medium text-slate-700" htmlFor="exam-subject">
            Subject
            <select id="exam-subject" className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3" value={subjectChoice} onChange={(event) => setSubjectChoice(event.target.value)}>
              {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
              <option value="Other">Other subject...</option>
            </select>
          </label>

          {subjectChoice === "Other" && (
            <label className="block text-sm font-medium text-slate-700" htmlFor="custom-subject">
              New subject name
              <input id="custom-subject" className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-300 px-3" value={customSubject} maxLength={80} onChange={(event) => setCustomSubject(event.target.value)} required />
            </label>
          )}

          <label className="block text-sm font-medium text-slate-700" htmlFor="exam-year">
            Exam year
            <input id="exam-year" className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-300 px-3" value={year} placeholder="2016 E.C." maxLength={40} onChange={(event) => setYear(event.target.value)} required />
          </label>

          <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-slate-700 sm:col-span-2">
            <input type="checkbox" className="size-4 accent-emerald-700" checked={isPremium} onChange={(event) => setIsPremium(event.target.checked)} />
            Premium exam (restricted to paid accounts)
          </label>
        </section>

        <section aria-labelledby="questions-heading">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="questions-heading" className="text-xl font-bold text-slate-900">Questions</h2>
              <p className="mt-1 text-sm text-slate-600">Add a prompt, four options, the answer key, and an explanation.</p>
            </div>
            <button type="button" className="min-h-11 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50" onClick={addQuestion}>
              Add question
            </button>
          </div>

          <ol className="space-y-5">
            {questions.map((question, questionIndex) => (
              <li key={question.key}>
                <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <legend className="sr-only">Question {questionIndex + 1}</legend>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">Question {questionIndex + 1}</h3>
                    {questions.length > 1 && (
                      <button type="button" className="min-h-10 rounded-lg px-3 text-sm font-medium text-rose-700 hover:bg-rose-50" onClick={() => setQuestions((current) => current.filter((item) => item.key !== question.key))}>
                        Remove
                      </button>
                    )}
                  </div>

                  <label className="block text-sm font-medium text-slate-700" htmlFor={`${question.key}-prompt`}>
                    Question text
                    <textarea id={`${question.key}-prompt`} className="mt-1.5 block min-h-24 w-full rounded-lg border border-slate-300 p-3" value={question.prompt} maxLength={2000} onChange={(event) => updateQuestion(question.key, { prompt: event.target.value })} required />
                  </label>

                  <fieldset className="mt-5 space-y-3">
                    <legend className="mb-2 text-sm font-medium text-slate-700">Answer options (select the correct answer)</legend>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionLetters[optionIndex]} className="flex items-start gap-3">
                        <input
                          type="radio"
                          className="mt-3 size-4 shrink-0 accent-emerald-700"
                          name={`${question.key}-correct-answer`}
                          aria-label={`Option ${optionLetters[optionIndex]} is correct`}
                          checked={question.correctOptionIndex === optionIndex}
                          onChange={() => updateQuestion(question.key, { correctOptionIndex: optionIndex })}
                        />
                        <label className="min-w-0 flex-1 text-sm text-slate-600" htmlFor={`${question.key}-option-${optionIndex}`}>
                          <span className="font-semibold">{optionLetters[optionIndex]}.</span>
                          <input id={`${question.key}-option-${optionIndex}`} className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-900" value={option} maxLength={500} onChange={(event) => updateOption(question.key, optionIndex, event.target.value)} required />
                        </label>
                      </div>
                    ))}
                  </fieldset>

                  <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor={`${question.key}-explanation`}>
                    Explanation
                    <textarea id={`${question.key}-explanation`} className="mt-1.5 block min-h-20 w-full rounded-lg border border-slate-300 p-3" value={question.explanation} maxLength={4000} onChange={(event) => updateQuestion(question.key, { explanation: event.target.value })} />
                  </label>
                </fieldset>
              </li>
            ))}
          </ol>
        </section>

        {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</Link>
          <button type="submit" disabled={pending} className="min-h-11 rounded-lg bg-purple-700 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? "Creating exam..." : "Create exam"}
          </button>
        </div>
      </form>
    </div>
  );
}

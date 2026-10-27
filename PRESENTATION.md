# Eight-Minute Capstone Walkthrough

## Before presenting

- Start PostgreSQL and run `npm run dev`.
- Confirm `npm run db:seed` has populated the sample exams and local test accounts.
- Keep the `admin@ethioexam.com`, `student.paid@ethioexam.com`, and `student.unpaid@ethioexam.com` accounts ready. Each local test account uses `password123`.
- Open these files in editor tabs: `lib/dal.ts`, `lib/actions/exams.ts`, `lib/safe-next.ts`, `app/exams/[subject]/[year]/page.tsx`, and `components/exam-quiz-runner.tsx`.

## Talk track

| Time | Demo and explanation |
| --- | --- |
| 0:00–1:00 | Introduce the goal: help Ethiopian Grade 12 learners practice national exam questions, get immediate explanations, and track their progress. |
| 1:00–3:00 | Sign in as the paid student. Browse a subject and year, open Physics 2015 E.C., scroll through questions, select an answer to reveal feedback, finish the paper, and view the saved score on the dashboard. |
| 3:00–5:00 | Explain the rendering boundary: the exam Server Component loads question text and options; the client quiz manages selection; a Server Action checks answers and computes the saved score. Show `app/exams/[subject]/[year]/page.tsx`, `components/exam-quiz-runner.tsx`, and `lib/actions/exams.ts`. |
| 5:00–6:00 | Show access and data protections: `verifySession()` validates the session, `verifyPaidSession()` checks admin/paid status, progress deletion filters by both record ID and owner ID, and `safeNext()` rejects external redirect destinations. Show `lib/dal.ts`, `lib/actions/exams.ts`, and `lib/safe-next.ts`. |
| 6:00–7:00 | Sign in as the unpaid student and open an exam to show the activation page. Then show the admin's grant-access control. Performance scores are not yet measured; see `PERF.md` for that status. |
| 7:00–8:00 | Summarize the scope choices: live payment processing, PDF downloads, and timed exams are documented for future work in `FUTURE.md`. |

## Live demo account sequence

1. Sign in as `student.paid@ethioexam.com` to demonstrate practice and the dashboard.
2. Sign in as `student.unpaid@ethioexam.com` to demonstrate the activation gate.
3. Sign in as `admin@ethioexam.com` to demonstrate user access management and `/admin/exams/new`.

These fixed-password accounts are local development fixtures only. Do not use them in a deployed environment.

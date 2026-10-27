# Data Access and Rendering

## Database reads

| Location | Query | Render/use |
| --- | --- | --- |
| `app/exams/page.tsx` | Select all exams, ordered by subject and year | Server Component; request-time database read. Uses sample fixtures if the database is unavailable. |
| `app/exams/[subject]/page.tsx` | Select years, question counts, and access labels for one subject | Server Component; request-time database read, ordered by year. |
| `app/exams/[subject]/[year]/page.tsx` | Find one exam by subject and year; select its questions by exam ID | Server Component; request-time database reads. Missing exams or incomplete question sets call `notFound()`. |
| `app/sitemap.ts` | Select subject and year for every exam | Request-time metadata route; adds each exam URL to the sitemap. Static public routes are returned if the database is offline. |
| `app/(protected)/admin/page.tsx` | Select user directory fields, ordered by creation date | Protected Server Component; session and admin role checked before the read. |
| `app/(protected)/admin/exams/new/page.tsx` | No direct data query | Protected Server Component; checks session and admin role before rendering the exam form. |
| `lib/actions/exams.ts:getUserProgress` | Select the signed-in user's attempts joined to exam subject and year, newest first | Server Action called by the dashboard query; filters by session user ID. |
| `lib/actions/exams.ts:revealExamAnswer` | Select one question's answer key and explanation, scoped to both question and exam IDs | Read-only Server Action invoked after a student chooses an option or requests the explanation. Answer keys are not sent with the initial page data. |
| `lib/actions/exams.ts:submitExamAttempt` | Read exam count and correct answer keys for that exam | Server Action; validates submitted question IDs and options, computes score on the server, then inserts a progress row tied to the session user. |
| `lib/actions/admin.ts:toggleUserPaidStatus` | Update one user's paid flag by user ID | Admin-only Server Action; revalidates `/admin` and `/dashboard`. |
| `lib/actions/admin.ts:setUserRole` | Update one user's role by user ID | Admin-only Server Action; prevents self-demotion and revalidates `/admin`. |
| `lib/actions/admin.ts:createExam` | Insert one exam and its questions in a transaction | Admin-only Server Action; validates fields, relies on the subject/year unique index, and revalidates the exam list, subject page, admin page, and sitemap. |
| `lib/actions/exams.ts:deleteUserProgress` | Delete a progress row by row ID and signed-in user ID | Server Action; ownership is part of the SQL filter; revalidates `/dashboard`. |

## Writes and seed data

`db/seed.ts` inserts the 2013-2015 E.C. sample exams for Mathematics, Physics, Biology, Chemistry, English, and SAT. It skips existing subject/year pairs so rerunning the seed does not duplicate exams. Outside production, it also ensures the three local test accounts documented in `README.md`, hashing their passwords with Better Auth's password utility. User accounts are otherwise created through Better Auth and its Drizzle adapter. `submitExamAttempt` inserts `user_progress`; the admin actions update `user.has_paid` and `user.role`; `createExam` inserts an exam and question set atomically; `deleteUserProgress` deletes only the current user's selected progress row.

## Rendering and caching

- Public home, auth, exam index, individual exams, dashboard, and admin pages are App Router Server Components. Database-backed pages render from current database state; protected pages also call `verifySession()`.
- Exam paper rendering calls `verifyPaidSession()` in the Data Access Layer. It validates the Better Auth session and allows `role === "admin"` or `hasPaid === true`; other signed-in users are redirected to `/pricing`. Subject and year browsing remains public.
- Exam browsing flows from the subject list to a subject/year list, then renders the full question set in one scrollable page. Answer choices and explanations expand in the client UI using feedback returned by a Server Action.
- The dashboard's attempt list is fetched through a React Query client call to `getUserProgress`, which verifies the session and scopes results to the current user.
- `lib/dal.ts` uses React `cache()` to reuse session verification during a server render.
- `app/sitemap.ts` is a dynamic metadata route because exam URLs come from PostgreSQL. The route falls back to its four fixed public URLs when PostgreSQL is unavailable.
- There is no application-level cache or time-based revalidation configured. Successful exam submission/deletion revalidates `/dashboard`; paid-status updates revalidate `/admin` and `/dashboard`; role updates revalidate `/admin`.
- `loading.tsx` files provide streaming/loading UI for the dashboard, admin area, and individual exam route.

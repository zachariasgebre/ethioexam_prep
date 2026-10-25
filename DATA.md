# Data Access and Rendering

## Database reads

| Location | Query | Render/use |
| --- | --- | --- |
| `app/exams/page.tsx` | Select all exams, ordered by subject and year | Server Component; request-time database read. Uses sample fixtures if the database is unavailable. |
| `app/exams/[subject]/[year]/page.tsx` | Find one exam by subject and year; select its questions by exam ID | Server Component; request-time database reads. Missing exams or incomplete question sets call `notFound()`. |
| `app/sitemap.ts` | Select subject and year for every exam | Request-time metadata route; adds each exam URL to the sitemap. Static public routes are returned if the database is offline. |
| `app/(protected)/admin/page.tsx` | Select user directory fields, ordered by creation date | Protected Server Component; session and admin role checked before the read. |
| `lib/actions/exams.ts:getUserProgress` | Select the signed-in user's attempts joined to exam subject and year, newest first | Server Action called by the dashboard query; filters by session user ID. |
| `lib/actions/exams.ts:submitExamAttempt` | Read exam count and correct answer keys for that exam | Server Action; validates submitted question IDs and options, computes score on the server, then inserts a progress row tied to the session user. |
| `lib/actions/admin.ts:toggleUserPaidStatus` | Update one user's paid flag by user ID | Admin-only Server Action; revalidates `/admin` and `/dashboard`. |
| `lib/actions/admin.ts:setUserRole` | Update one user's role by user ID | Admin-only Server Action; prevents self-demotion and revalidates `/admin`. |
| `lib/actions/exams.ts:deleteUserProgress` | Delete a progress row by row ID and signed-in user ID | Server Action; ownership is part of the SQL filter; revalidates `/dashboard`. |

## Writes and seed data

`db/seed.ts` inserts the sample exams and their questions. User accounts are created through Better Auth and its Drizzle adapter. `submitExamAttempt` inserts `user_progress`; the admin actions update `user.has_paid` and `user.role`; `deleteUserProgress` deletes only the current user's selected progress row.

## Rendering and caching

- Public home, auth, exam index, individual exams, dashboard, and admin pages are App Router Server Components. Database-backed pages render from current database state; protected pages also call `verifySession()`.
- The dashboard's attempt list is fetched through a React Query client call to `getUserProgress`, which verifies the session and scopes results to the current user.
- `lib/dal.ts` uses React `cache()` to reuse session verification during a server render.
- `app/sitemap.ts` is a dynamic metadata route because exam URLs come from PostgreSQL. The route falls back to its four fixed public URLs when PostgreSQL is unavailable.
- There is no application-level cache or time-based revalidation configured. Successful exam submission/deletion revalidates `/dashboard`; paid-status updates revalidate `/admin` and `/dashboard`; role updates revalidate `/admin`.
- `loading.tsx` files provide streaming/loading UI for the dashboard, admin area, and individual exam route.

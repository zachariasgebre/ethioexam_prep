# EthioExam Prep

Next.js App Router starter for Ethiopian national exam practice.

## Setup

1. Install Node.js 20.9+ and PostgreSQL.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL`, `BETTER_AUTH_SECRET` (use a long random value), and `BETTER_AUTH_URL`.
3. Run `npm install`.
4. Generate and apply the database schema with `npm run db:generate` and `npm run db:migrate` (or `npm run db:push` for local prototyping).
5. Add the sample exams with `npm run db:seed`.
6. Start the app with `npm run dev`.

The database schema, sample seed data, Better Auth integration, and sign-in/sign-up forms are in place. Exam quiz flow and the student progress dashboard are outside the Day 1 setup scope.

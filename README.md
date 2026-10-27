# EthioExam Prep

EthioExam Prep turns Ethiopian national exam papers into scrollable multiple-choice practice. Students can review answers and explanations, save their scores, and track performance. Administrators can manage account access and add exams.

## Features

- Browse exams by subject and year.
- Answer all questions on a single scrollable exam page and reveal explanations as you go.
- Save completed exam scores and review history and charts on the student dashboard.
- Gate exam papers behind account activation; admins and paid accounts can practice.
- Let admins grant or revoke paid access and create new exams with questions and answer keys.
- Use loading, empty, error, keyboard-focus, and mobile layouts throughout the app.

## Requirements

- Node.js 20.9 or newer and npm.
- PostgreSQL 14 or newer, running locally or hosted.

## Run from a fresh clone

1. Clone the repository and enter its folder:

   ```bash
   git clone <repository-url>
   cd ethioexam_prep
   ```

2. Create a PostgreSQL database named `ethioexam_prep`. For example, in pgAdmin, connect to your local server, open the Query Tool, and run:

   ```sql
   CREATE DATABASE ethioexam_prep;
   ```

3. Install the locked project dependencies:

   ```bash
   npm ci
   ```

4. Copy `.env.example` to `.env.local`. In PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Edit `.env.local` and set `DATABASE_URL` to your local PostgreSQL username, password, and database. The example uses the common `postgres` user and local port `5432`; adjust it if yours differs. URL-encode special characters in the password (for example, `@` becomes `%40`).

   Generate a Better Auth secret in a terminal:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
   ```

   Copy the generated value into `BETTER_AUTH_SECRET`. For local development, set `NEXT_PUBLIC_APP_URL=http://localhost:3000`.

5. Create the database tables from the Drizzle schema:

   ```bash
   npm run db:push
   ```

6. Add sample exams and local test accounts:

   ```bash
   npm run db:seed
   ```

7. Start Next.js:

   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000).

The Drizzle commands read `.env.local` directly. Keep that file private; it contains your database password and authentication secret, and is excluded from Git.

## Local test accounts

The seed creates or resets these accounts outside production. Passwords are hashed with Better Auth. The fixed test accounts are skipped when `NODE_ENV=production`.

| Account | Email | Password | Access |
| --- | --- | --- | --- |
| Admin | `admin@ethioexam.com` | `password123` | Admin portal and exams |
| Paid student | `student.paid@ethioexam.com` | `password123` | Exam practice and dashboard |
| Unpaid student | `student.unpaid@ethioexam.com` | `password123` | Dashboard; exam papers lead to activation page |

These are development credentials. Do not enable the fixed-password accounts in a deployed environment.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Welcome page |
| `/exams` | Browse subjects |
| `/exams/[subject]` | Browse exam years for a subject |
| `/exams/[subject]/[year]` | Take the exam; sign-in and activation checks run on the server |
| `/pricing` | Explain that an administrator must activate unpaid accounts |
| `/sign-in` and `/sign-up` | Better Auth email/password forms |
| `/dashboard` | Personal scores, charts, and attempt history |
| `/admin` | Admin-only user access management |
| `/admin/exams/new` | Admin-only exam and question creation |

The sign-in form stays available when another account is already signed in, so you can enter different student or admin credentials to switch accounts.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Build the production app |
| `npm run start` | Serve a production build |
| `npm run db:push` | Apply the current schema directly to the configured database (local prototyping) |
| `npm run db:generate` | Generate a Drizzle migration from schema changes |
| `npm run db:migrate` | Apply generated Drizzle migrations |
| `npm run db:seed` | Add sample exams and ensure local test accounts |

## Deploy to Vercel with Neon or Supabase

1. Create a PostgreSQL database in Neon or Supabase. Copy its connection string; use the provider's pooled connection URL for a serverless app, and ensure it includes SSL requirements. Keep the URL private.
2. Push this repository to GitHub and import it into Vercel. Vercel detects Next.js automatically; the default build command is `npm run build`.
3. In **Vercel → Project → Settings → Environment Variables**, add these for Production (and Preview if needed):
   - `DATABASE_URL`: the Neon/Supabase PostgreSQL connection string.
   - `BETTER_AUTH_SECRET`: a unique random secret (generate with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`). Do not reuse the example or commit it.
   - `NEXT_PUBLIC_APP_URL`: the deployed site origin, such as `https://your-project.vercel.app` (no trailing slash). Set the matching production domain after adding it.
4. Before deploying, apply the Drizzle schema to the hosted database from a trusted local terminal with the production `DATABASE_URL` set: `npm run db:push`. For ongoing production schema changes, generate and review migrations with `npm run db:generate`, then apply them with `npm run db:migrate`. Never run the seed command in production; it creates fixed-password demo accounts in development only.
5. Redeploy after setting variables. Verify sign-up/sign-in, exam access, and dashboard against the deployed database. Add the Vercel deployment origin to any provider-side allowed origins if you configure origin restrictions.

Do not commit `.env.local`, paste secrets into source code, or use the local test credentials in production. Vercel environment variables are read at build/runtime as appropriate; redeploy after changing them.

## Project documentation

- [AUTH.md](AUTH.md) describes session, ownership, role, and payment checks.
- [DATA.md](DATA.md) lists database reads, writes, render behavior, and revalidation.
- [PERF.md](PERF.md) records the accessibility/performance review and measurement status.
- [FUTURE.md](FUTURE.md) lists features intentionally deferred from this capstone.
- [PRESENTATION.md](PRESENTATION.md) contains an eight-minute demo and code walkthrough.

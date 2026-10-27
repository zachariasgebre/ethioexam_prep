# Performance and Accessibility Review

## Lighthouse measurements

No before/after Lighthouse scores are recorded yet. This workspace does not include the Lighthouse CLI, and a score needs a running deployment (plus a configured database for representative exam and protected pages). Reporting numbers without running that measurement would be misleading.

| Page | Before | After | Status |
| --- | --- | --- | --- |
| Home | Not measured | Not measured | Requires Lighthouse against a running app |
| Exam index | Not measured | Not measured | Requires a running database or documented fixture mode |
| Student dashboard | Not measured | Not measured | Requires a configured database and authenticated account |

To capture comparable measurements, run the same production build and Lighthouse version on the same machine, browser, URL, and mobile/desktop profile before and after changes. Record Performance, Accessibility, Best Practices, and SEO scores here with the Lighthouse version and test URL.

## Day 4 changes

- Added page-specific titles and descriptions for sign-in, sign-up, and individual exam pages, plus application and Open Graph metadata at the root layout.
- Made the sitemap include available exam URLs and kept its fixed public routes available if the database is offline. Added API routes to the robots disallow list.
- Added a visible keyboard focus indicator and disabled-button cursor treatment.
- Reviewed interactive controls: quiz navigation/submission, admin changes, dashboard retry, and history deletion use native buttons; navigation uses links. Form inputs have associated labels, and status/error messages use live or alert roles.
- Reviewed route headings and image usage: each page has one page-level `h1`; the current UI does not render content images that need alt text.

## Verification limits

`npm run lint` completes with zero errors and one existing style warning in `postcss.config.mjs`. The production build completes with the local `.env.local` configuration and PostgreSQL available. The generated route table reports `/sitemap.xml` as dynamic.

The Day 4 security battery was reviewed against the server action implementations and documented in `DATA.md`/`AUTH.md`. Live console/RPC attempts and a two-account cross-user deletion attempt require a running PostgreSQL-backed app and authenticated browser sessions; those runtime checks have not been performed in this workspace. An isolated `safeNext()` check could not start because Node reported `uv_os_get_passwd returned ENOMEM`, so Attack 3 has source review but no runtime result.

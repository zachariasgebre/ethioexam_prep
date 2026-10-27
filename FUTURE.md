# Future Work

This capstone focuses on browsing past exams, practicing questions, saving results, and managing access. The following features were left outside its current scope.

## Payments and subscriptions

The current `hasPaid` flag is an admin-controlled access switch. A future version could add a payment provider checkout, verified payment webhooks, subscription renewal/cancellation handling, receipts, and a user-facing billing history. Payment access should only change after a verified provider event.

## Exam delivery

- Add timed exam sessions with a visible countdown, autosave, and clear rules for pause and submission.
- Support PDF viewing or downloads with licensing and source attribution for each paper.
- Add question import tools so administrators can create larger exams without entering every question in the form.
- Expand the sample dataset with reviewed questions and explanations for additional subjects and years.

## Student experience

- Add password reset and email verification delivery.
- Add study plans, bookmarks, and review queues for missed questions.
- Expand performance reporting with subject-level trends and comparisons across multiple attempts.

## Administration and operations

- Add an audit history for role, paid-access, and exam-content changes.
- Add bulk user management and exam import validation.
- Establish deployment-specific PostgreSQL migrations, backups, monitoring, and automated checks before production use.

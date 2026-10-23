# Authentication & Security Architecture: The 3 Attacks Prevention Matrix

This document details the security model of **EthioExam Prep**, specifically explaining the multi-layered defenses and the exact files and lines stopping the **Three Critical Attacks**.

---

## 1. Multi-Layer Defense Architecture

EthioExam Prep enforces a 3-layer defense-in-depth model:

1. **Layer 1: Edge Proxy Pre-Filter (`middleware.ts`)**  
   Evaluates the presence of Better Auth session cookies (`better-auth.session_token` / `getSessionCookie`) on protected route paths (`/dashboard/:path*`, `/admin/:path*`). Rapidly redirects unauthenticated browser requests before running heavier server work.
2. **Layer 2: Server Data Access Layer (`lib/dal.ts`)**  
   Cached per-request via React `cache()`. Invokes `auth.api.getSession({ headers: await headers() })` directly against the database on the server, ensuring that forged, expired, or manipulated cookies cannot pass.
3. **Layer 3: Row-Level Scoping & Mutation Guards (`lib/actions/*.ts`)**  
   Every server action strictly ties database mutations to the authenticated user ID extracted from the trusted server session.

---

## 2. The 3 Attacks Prevention Matrix

### Attack 1: Unauthenticated Write / Mutation Execution (Direct RPC Attack)

* **Threat Scenario**: A malicious visitor or bot identifies the Next.js Server Action RPC endpoint (e.g. `submitExamAttempt`, `deleteUserProgress`, `toggleUserPaidStatus`, or `setUserRole`) and sends a raw HTTP POST request directly from the browser console or cURL without having an active authenticated session.
* **Vulnerability if Unchecked**: Unauthenticated visitors could log arbitrary exam scores, delete existing database records, grant themselves paid access, or elevate their privileges to administrator.
* **Mitigation Implementation**:
  Every single write action invokes `verifySession()` on its very first execution line before processing any payload or issuing database statements. If no valid session is found, `verifySession()` immediately halts execution and triggers a redirect to `/sign-in` or throws.

#### Concrete Code References for Attack 1:

| Action File | Function | Line Number(s) | Defense Logic |
| :--- | :--- | :--- | :--- |
| `lib/actions/exams.ts` | `submitExamAttempt` | Lines 10 | `const { user } = await verifySession();` verifies active session before writing progress. |
| `lib/actions/exams.ts` | `deleteUserProgress` | Lines 26 | `const { user } = await verifySession();` verifies active session before allowing deletions. |
| `lib/actions/admin.ts` | `toggleUserPaidStatus` | Lines 15 & 18–20 | `const { user: currentUser } = await verifySession();` followed by `currentUser.role !== "admin"` check. |
| `lib/actions/admin.ts` | `setUserRole` | Lines 47 & 50–52 | `const { user: currentUser } = await verifySession();` followed by `currentUser.role !== "admin"` check. |

---

### Attack 2: Horizontal Privilege Escalation / Cross-User Data Tampering (IDOR)

* **Threat Scenario**: An authenticated user ("Student A") inspects their network requests, discovers a progress record ID belonging to another user ("Student B"), and attempts to invoke `deleteUserProgress(studentB_ProgressId)` to delete Student B's exam history.
* **Vulnerability if Unchecked**: Insecure Direct Object References (IDOR) allow any signed-in student to alter or delete any other student's records simply by guessing or providing another record's UUID.
* **Mitigation Implementation**:
  Every mutation query explicitly scopes the database WHERE clause with both the target resource's ID and the authenticated user's ID (`eq(userProgress.userId, user.id)`). Even if an attacker supplies a valid record UUID belonging to another student, the database query returns 0 modified rows and refuses the operation with `"Record not found or unauthorized"`.
  For administrative operations (`lib/actions/admin.ts`), an explicit role check ensures standard users cannot execute admin modifications even if they know the action endpoints.

#### Concrete Code References for Attack 2:

| Action File | Function | Line Number(s) | Defense Logic |
| :--- | :--- | :--- | :--- |
| `lib/actions/exams.ts` | `deleteUserProgress` | Lines 27–30 | `.where(and(eq(userProgress.id, progressId), eq(userProgress.userId, user.id)))` prevents modifying another student's record. |
| `lib/actions/exams.ts` | `submitExamAttempt` | Line 20 | `userId: user.id` strictly forces the record to attach exclusively to the session owner's ID, ignoring any spoofed client identity. |
| `lib/actions/admin.ts` | `setUserRole` | Lines 58–60 | Prevents self-demotion lockout: `targetUserId === currentUser.id && role !== "admin"`. |

---

### Attack 3: Open Redirect Vulnerability via Manipulated `next` Parameter

* **Threat Scenario**: An attacker constructs a phishing link such as `https://ethioexam-prep.com/sign-in?next=https://malicious-phishing-site.com` or obfuscated paths like `//evil.com` or `/\evil.com`. A victim logs in, and upon completion, the client-side router blindly redirects them to the attacker's phishing destination.
* **Vulnerability if Unchecked**: Open redirects destroy user trust and facilitate credential theft via subsequent spoofed login screens.
* **Mitigation Implementation**:
  All redirect destinations are sanitized through `safeNext()` in `lib/safe-next.ts`. The validator enforces:
  1. The parameter must be a string.
  2. It must begin with a single slash `/`.
  3. It must NOT begin with protocol-relative `//` or backslash-escaped `/\`.
  If any validation condition fails, it safely falls back to internal `/dashboard`.

#### Concrete Code References for Attack 3:

| Component / Utility File | Function / Location | Line Number(s) | Defense Logic |
| :--- | :--- | :--- | :--- |
| `lib/safe-next.ts` | `safeNext` | Lines 1–6 | Sanitizes the redirect target, rejecting off-site and protocol-relative schemes. |
| `components/sign-in-form.tsx` | `handleSubmit` | Line 16 | `router.push(safeNext(nextTo));` wraps navigation in sanitization. |
| `components/sign-up-form.tsx` | `handleSubmit` | Line 16 | `router.push(safeNext(nextTo));` wraps navigation in sanitization. |
| `middleware.ts` | `middleware` | Line 7 | Sets `next` strictly to `request.nextUrl.pathname` (always internal relative path). |

---

## 3. Summary Audit Table

| Attack Vector | Threat Level | Defense Technique | Verified File Locations |
| :--- | :--- | :--- | :--- |
| **Attack 1 (Unauthenticated RPC)** | Critical | DAL Server Session Verification (`verifySession()`) | `lib/actions/exams.ts:10,26`<br>`lib/actions/admin.ts:15,47` |
| **Attack 2 (IDOR / Cross-User Deletion)** | High | Composite Key Scoping (`eq(userId, user.id)`) | `lib/actions/exams.ts:27-30` |
| **Attack 3 (Open Redirect)** | Medium | Path Whitelisting & Prefix Enforcement (`safeNext()`) | `lib/safe-next.ts:1-6`<br>`components/sign-in-form.tsx:16`<br>`components/sign-up-form.tsx:16` |


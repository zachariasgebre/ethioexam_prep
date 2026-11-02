"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { safeNext } from "@/lib/safe-next";

export function SignInForm({ nextTo }: { nextTo?: string }) {
  const router = useRouter(); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setPending(true);
    const data = new FormData(event.currentTarget);
    try {
      const result = await authClient.signIn.email({ email: String(data.get("email")), password: String(data.get("password")) });
      if (result.error) { setError(result.error.message ?? "Unable to sign in. Check your details and try again."); return; }
      router.push(safeNext(nextTo)); router.refresh();
    } catch { setError("Unable to sign in right now. Please try again."); }
    finally { setPending(false); }
  }
  return <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
    <label className="block text-sm font-semibold text-slate-700">Email<input className="ui-field mt-2" type="email" name="email" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" required /></label>
    <label className="block text-sm font-semibold text-slate-700">Password<input className="ui-field mt-2" type="password" name="password" autoComplete="current-password" placeholder="Enter your password" required /></label>
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">{error}</p>}
    <button className="ui-button ui-button-primary w-full" type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}

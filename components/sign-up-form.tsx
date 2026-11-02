"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { safeNext } from "@/lib/safe-next";

export function SignUpForm({ nextTo }: { nextTo?: string }) {
  const router = useRouter(); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setPending(true);
    const data = new FormData(event.currentTarget);
    try {
      const result = await authClient.signUp.email({ name: String(data.get("name")), email: String(data.get("email")), password: String(data.get("password")) });
      if (result.error) { setError(result.error.message ?? "Unable to create your account. Try again."); return; }
      router.push(safeNext(nextTo)); router.refresh();
    } catch { setError("Unable to create your account right now. Please try again."); }
    finally { setPending(false); }
  }
  return <form className="space-y-5" onSubmit={handleSubmit}>
    <label className="block text-sm font-semibold text-slate-700">Name<input className="ui-field mt-2" type="text" name="name" autoComplete="name" placeholder="Your name" minLength={2} required /></label>
    <label className="block text-sm font-semibold text-slate-700">Email<input className="ui-field mt-2" type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
    <label className="block text-sm font-semibold text-slate-700">Password<input className="ui-field mt-2" type="password" name="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} required /></label>
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">{error}</p>}
    <button className="ui-button ui-button-primary w-full" type="submit" disabled={pending}>{pending ? "Creating account…" : "Create account"}</button>
  </form>;
}

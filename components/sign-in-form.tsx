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
  return <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
    <label className="block text-sm font-medium">Email<input className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2" type="email" name="email" autoComplete="email" required /></label>
    <label className="block text-sm font-medium">Password<input className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2" type="password" name="password" autoComplete="current-password" required /></label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60" type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}

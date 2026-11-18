"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type ProfileMenuProps = { name: string; email: string; role: string };

export function ProfileMenu({ name, email, role }: ProfileMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "S";

  async function signOut() {
    setPending(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError("Could not sign out. Please try again.");
        return;
      }
      menuRef.current?.removeAttribute("open");
      router.replace("/");
      router.refresh();
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <details ref={menuRef} className="group/profile relative">
      <summary aria-label={`Open profile menu for ${name}`} className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-emerald-100 bg-white/80 py-1 pl-1 pr-3 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 [&::-webkit-details-marker]:hidden">
        <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-xs font-extrabold text-white ring-2 ring-white">{initials}</span>
        <span className="hidden max-w-32 truncate text-sm font-bold text-slate-800 sm:block">{name}</span>
        <svg className="size-4 text-slate-500 transition group-open/profile:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
      </summary>
      <div className="absolute right-0 top-full z-40 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15">
        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 px-3 py-3">
          <p className="truncate text-sm font-bold text-slate-900">{name}</p>
          <p className="truncate text-xs text-slate-600">{email}</p>
          <span className="mt-2 inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">{role === "admin" ? "Administrator" : "Student"}</span>
        </div>
        <Link href="/dashboard" className="mt-2 flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">My dashboard</Link>
        {role === "admin" && <Link href="/admin" className="flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50">Admin portal</Link>}
        {error && <p className="px-3 py-2 text-xs text-rose-700" role="alert">{error}</p>}
        <button type="button" onClick={signOut} disabled={pending} className="mt-1 flex min-h-10 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60">
          {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </details>
  );
}

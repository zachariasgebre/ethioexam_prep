import Link from "next/link";
import { ProfileMenu } from "@/components/profile-menu";
import { getCurrentSession } from "@/lib/current-session";

export async function Navbar() {
  let currentUser: { name: string; email: string; role: string } | null = null;
  try {
    const session = await getCurrentSession();
    if (session) currentUser = { name: session.user.name, email: session.user.email, role: session.user.role };
  } catch {
    // Keep public navigation available if the auth database is temporarily unavailable.
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 shadow-sm shadow-emerald-950/5 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Link href="/" className="group flex items-center gap-3 rounded-xl" aria-label="EthioExam Prep home">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition-transform group-hover:-rotate-3 group-hover:scale-105">E</span>
          <span className="font-extrabold tracking-tight text-slate-900">Ethio<span className="text-emerald-700">Exam</span></span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 sm:px-4" href="/exams">Exams</Link>
          <Link className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-800 sm:px-4" href="/dashboard">Dashboard</Link>
          {currentUser ? (
            <ProfileMenu {...currentUser} />
          ) : (
            <div className="flex items-center gap-2">
              <Link className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800" href="/sign-in">Sign in</Link>
              <Link className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700" href="/sign-up">Create account</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

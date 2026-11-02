import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignUpForm } from "@/components/sign-up-form";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create account | EthioExam Prep",
  description: "Create an account to track your Ethiopian national exam practice.",
};

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/dashboard");
  const signinHref = typeof next === "string" ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in";

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
      <Image src="/classroom-bg.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[58%_center]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-slate-950/60 backdrop-blur-[1px]" />
      <div className="relative w-full max-w-md rounded-3xl border border-white/50 bg-white/95 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-9">
        <header className="mb-7">
          <Link href="/" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-emerald-700">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-700 text-lg font-black text-white shadow-lg shadow-emerald-900/20">E</span>
            <span>
              <span className="block text-sm font-bold tracking-tight text-slate-900">EthioExam Prep</span>
              <span className="mt-0.5 block text-xs text-slate-500">Build confidence one question at a time</span>
            </span>
          </Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Get started</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Save your exam results and follow your progress over time.</p>
        </header>

        <SignUpForm nextTo={typeof next === "string" ? next : undefined} />

        <p className="mt-7 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-950" href={signinHref}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

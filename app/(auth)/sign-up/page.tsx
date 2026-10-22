import Link from "next/link";
import { SignUpForm } from "@/components/sign-up-form";

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next } = await searchParams;
  const signinHref = typeof next === "string" ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in";
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6"><h1 className="text-3xl font-bold">Create your account</h1><p className="mt-2 text-slate-600">Start building your exam preparation plan.</p><SignUpForm nextTo={typeof next === "string" ? next : undefined} /><p className="mt-6 text-sm text-slate-600">Already have an account? <Link className="text-emerald-800 underline" href={signinHref}>Sign in</Link></p></main>;
}

import Link from "next/link";
import type { Metadata } from "next";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = { title: "Sign in | EthioExam Prep", description: "Sign in to continue your exam preparation." };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next } = await searchParams;
  const signupHref = typeof next === "string" ? `/sign-up?next=${encodeURIComponent(next)}` : "/sign-up";
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6"><h1 className="text-3xl font-bold">Sign in</h1><p className="mt-2 text-slate-600">Enter the email and password for the account you want to use.</p><SignInForm nextTo={typeof next === "string" ? next : undefined} /><p className="mt-6 text-sm text-slate-600">New here? <Link className="text-emerald-800 underline" href={signupHref}>Create an account</Link></p></main>;
}

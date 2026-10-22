import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function AdminPage() {
  const { user } = await verifySession();
  if (user.role !== "admin") notFound();
  return <main className="mx-auto max-w-5xl px-6 py-16"><h1 className="text-3xl font-bold">Admin</h1><p className="mt-3 text-slate-600">Administration tools will appear here.</p></main>;
}

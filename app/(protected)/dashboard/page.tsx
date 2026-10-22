import { verifySession } from "@/lib/dal";

export default async function DashboardPage() {
  const { user } = await verifySession();
  return <main className="mx-auto max-w-5xl px-6 py-16"><h1 className="text-3xl font-bold">Welcome, {user.name}</h1><p className="mt-3 text-slate-600">Your exam progress will appear here.</p></main>;
}

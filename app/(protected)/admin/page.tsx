import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { user } from "@/db/schema";
import { verifySession } from "@/lib/dal";
import { AdminToggleAccess } from "@/components/admin-toggle-access";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Admin Portal | EthioExam Prep",
  description: "Manage users, access permissions, and roles.",
};

export default async function AdminPage() {
  // Layer 2: Server-side Data Access Layer verification (Attack 1 prevention)
  const { user: currentUser } = await verifySession();

  // Strict Role Guard: Non-admin users receive a 404
  if (currentUser.role !== "admin") {
    notFound();
  }

  // Fetch all registered users
  const allUsers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasPaid: user.hasPaid,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(user.createdAt);

  const totalUsers = allUsers.length;
  const adminCount = allUsers.filter((u) => u.role === "admin").length;
  const paidCount = allUsers.filter((u) => u.hasPaid).length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Security Guarded</span>
            <Badge className="bg-purple-100 text-purple-800">Admin Only</Badge>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Administration Portal</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage user roles, grant or revoke premium exam access, and monitor platform accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <section aria-label="System Metrics" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Registered Users</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalUsers}</p>
          </div>
          <p className="mt-3 text-xs text-slate-500">All student and administrative accounts</p>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Active Paid Subscriptions</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">{paidCount}</p>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {totalUsers > 0 ? Math.round((paidCount / totalUsers) * 100) : 0}% of student accounts
          </p>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Administrators</p>
            <p className="mt-2 text-3xl font-bold text-purple-700">{adminCount}</p>
          </div>
          <p className="mt-3 text-xs text-slate-500">Elevated access with permission to modify roles</p>
        </Card>
      </section>

      {/* User Management Section */}
      <section aria-label="User Management Table" className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">User Directory</h2>
          <span className="text-xs font-medium text-slate-500">{totalUsers} account{totalUsers === 1 ? "" : "s"} found</span>
        </div>

        {allUsers.length === 0 ? (
          <Card className="py-12 text-center">
            <p className="text-slate-600">No users found in database.</p>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th scope="col" className="px-6 py-4">User</th>
                    <th scope="col" className="px-6 py-4">Role</th>
                    <th scope="col" className="px-6 py-4">Access Status</th>
                    <th scope="col" className="px-6 py-4">Registered</th>
                    <th scope="col" className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers.map((u) => {
                    const isSelf = u.id === currentUser.id;
                    return (
                      <tr key={u.id} className="transition hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">
                              {u.name} {isSelf && <span className="ml-1 text-xs font-normal text-emerald-700">(You)</span>}
                            </span>
                            <span className="text-xs text-slate-500">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.role === "admin" ? (
                            <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-700">User</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.hasPaid ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Paid Access
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <span className="h-2 w-2 rounded-full bg-slate-400" />
                              Free Tier
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <AdminToggleAccess
                            targetUser={{
                              id: u.id,
                              name: u.name,
                              email: u.email,
                              role: u.role,
                              hasPaid: u.hasPaid,
                            }}
                            isCurrentUser={isSelf}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
